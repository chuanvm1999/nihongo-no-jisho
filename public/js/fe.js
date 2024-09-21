import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    thayDoiAPIKey,
    capNhatLichSuTimKiem,
} from './history.js';
import {
    layDuLieuTuLocalStorage,
    layAPIKeyTuLocalStorage,
    luuDuLieuVaoLocalStorage
} from './data.js';
import {
    hienThiKetQua,
} from './display.js';
import {
    handleHelpButtonClick,
    handleMaziiButtonClick,
    handleDOMContentLoaded,
    handleKeyDown,
    handleTraTuClick,
    handleLamMoiClick,
    handleFlipCardClick
} from './events.js';
import {
    goiAPI,
    dichVanBan
} from './api.js'

// Lấy các phần tử HTML cần thiết
const divKetQua = document.getElementById('ketQua');
const btnTraTu = document.getElementById('btnTraTu');
const btnLamMoi = document.getElementById('btnLamMoi');
const btnMazii = document.getElementById('btn-mazii');
const helpButton = document.getElementById('btnHuongDan');

// Lấy API key từ localStorage
const API_KEY = await layAPIKeyTuLocalStorage();

// Khởi tạo đối tượng Google Generative AI
let _genAI = new GoogleGenerativeAI(API_KEY);
let _model = _genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Tạo object chứa các hàm và thuộc tính liên quan đến model AI
export const modelUltis = {
    get model() {
        return _model;
    },
    set model(value) {
        _model = value;
    },
    get genAI() {
        return _genAI;
    },
    set genAI(value) {
        _genAI = value;
        // Khởi tạo lại model khi genAI thay đổi
        _model = _genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
};

// Danh sách ID của các nút điều khiển cho phần vẽ Kanji
export const btnList = {
    play: "btn-draw-p",
    stop: "btn-draw-s",
    next: "btn-draw-n",
    back: "btn-draw-b",
    reset: "btn-draw-r",
};

// Biến lưu trữ từ vựng tìm kiếm hiện tại
let _tuVungTimKiem = '';
// Biến lưu trữ dữ liệu lịch sử tìm kiếm
let _lichSuTimKiemData = layDuLieuTuLocalStorage('lichSuTimKiem') || [];

// Tạo object chứa các hàm và thuộc tính liên quan đến tìm kiếm
export const searchUtils = {
    get tuVungTimKiem() {
        return _tuVungTimKiem;
    },
    set tuVungTimKiem(value) {
        _tuVungTimKiem = value;
    },
    get lichSuTimKiemData() {
        return _lichSuTimKiemData;
    },
    set lichSuTimKiemData(value) {
        _lichSuTimKiemData = value;
        // Lưu lịch sử tìm kiếm vào localStorage khi thay đổi
        luuDuLieuVaoLocalStorage('lichSuTimKiem', _lichSuTimKiemData);
    }
};

/**
 * Đánh dấu đã hiển thị hướng dẫn sử dụng.
 */
export function danhDauDaHienThiHuongDan() {
    localStorage.setItem('daHienThiHuongDan', 'true');
}

/**
 * Xử lý tìm kiếm từ vựng.
 * @param {string} tuTiengNhat - Từ tiếng Nhật cần tìm kiếm.
 * @param {string} dichNgonNgu - Loại dịch ('tra-tu', 'jp-vn', 'vn-jp'), mặc định là 'tra-tu'.
 */
export function xuLyTimKiem(tuTiengNhat, dichNgonNgu = 'tra-tu') {
    // Lấy loại dịch từ dropdown nếu không được truyền vào
    dichNgonNgu = dichNgonNgu || document.getElementById('dich-ngon-ngu').value;

    // Kiểm tra xem chuỗi có phải tiếng Nhật hay không
    const isJapanese = (str) => !/[!#$%^&*()+=\[\]{};':"\\|,.<>\/?]/g.test(str) && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g.test(str);

    /**
     * Hiển thị kết quả dịch.
     * @param {object} result - Kết quả dịch.
     */
    const hienThiKetQuaDich = (result) => {
        divKetQua.innerHTML = '';
        const pDich = document.createElement('p');
        pDich.textContent = result.ketQuaDich;
        divKetQua.appendChild(pDich);
        if (result.cachDoc) {
            const pCachDoc = document.createElement('p');
            pCachDoc.textContent = `Cách đọc: ${result.cachDoc}`;
            divKetQua.appendChild(pCachDoc);
        }
        divKetQua.style.display = 'block';
    };

    // Nếu không phải tiếng Nhật, dịch từ tiếng Việt sang tiếng Nhật
    if (!isJapanese(tuTiengNhat)) {
        document.getElementById('dich-ngon-ngu').value = 'vn-jp';
        dichVanBan(tuTiengNhat.trim(), false)
            .then(result => {
                if (result) {
                    hienThiKetQuaDich(result);
                } else {
                    alert('Lỗi khi dịch văn bản.');
                }
            });
        return;
    }

    // Xử lý theo loại dịch
    switch (dichNgonNgu) {
        case 'tra-tu':
            // Tìm kiếm trong lịch sử tìm kiếm trước
            const data = _lichSuTimKiemData.find(item => item.tu === tuTiengNhat)?.data;
            if (data) {
                hienThiKetQua(data);
                return;
            }
            // Nếu không tìm thấy trong lịch sử, gọi API
            goiAPI(tuTiengNhat.trim());
            break;
        case 'jp-vn':
        case 'vn-jp':
            // Dịch văn bản sử dụng Google Translate API
            const typeTrans = isJapanese(tuTiengNhat);
            document.getElementById('dich-ngon-ngu').value = typeTrans ? 'jp-vn' : 'vn-jp';
            dichVanBan(tuTiengNhat.trim(), typeTrans)
                .then(result => {
                    if (result) {
                        hienThiKetQuaDich(result);
                    } else {
                        alert('Lỗi khi dịch văn bản.');
                    }
                });
            break;
    }
}

// Gán sự kiện cho các nút và sự kiện DOMContentLoaded
helpButton.addEventListener('click', handleHelpButtonClick);
btnMazii.addEventListener("click", handleMaziiButtonClick);
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
document.addEventListener('keydown', handleKeyDown);
btnTraTu.addEventListener('click', handleTraTuClick);
btnLamMoi.addEventListener('click', handleLamMoiClick);
document.getElementById("btnThayDoiAPIKey").addEventListener("click", thayDoiAPIKey);
document.getElementById("btn-flip-card").addEventListener('click', handleFlipCardClick);

// Cập nhật lịch sử tìm kiếm khi trang được tải
capNhatLichSuTimKiem();
