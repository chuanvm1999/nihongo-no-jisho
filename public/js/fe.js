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
let _model = _genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

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
    if (searchUtils.tuVungTimKiem === "") {
        return;
    }
    // Lấy loại dịch từ dropdown nếu không được truyền vào
    dichNgonNgu = dichNgonNgu || document.getElementById('dich-ngon-ngu').value;

    // Kiểm tra xem chuỗi có phải tiếng Nhật hay không
    const isJapanese = (str) => !/[!#$%^&*()+=\[\]{};':"\\|,.<>\/?]/g.test(str) && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g.test(str);

    /**
     * Hiển thị kết quả dịch.
     * @param {object} result - Kết quả dịch.
     * @param {string} tuGoc - Từ gốc cần dịch.
     */
    const hienThiKetQuaDich = (result, tuGoc) => {
        divKetQua.innerHTML = '';

        // Hiển thị từ gốc
        const pTuGoc = document.createElement('p');
        pTuGoc.textContent = `${tuGoc}`;
        pTuGoc.classList.add('font-bold'); // Làm đậm từ gốc
        divKetQua.appendChild(pTuGoc);

        // Hiển thị từ đã dịch
        const pDich = document.createElement('span');
        pDich.textContent = `${result.ketQuaDich}`;
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
                    hienThiKetQuaDich(result, tuTiengNhat.trim()); // Truyền thêm tuTiengNhat
                } else {
                    alert('Lỗi khi dịch văn bản.');
                }
            });
        return;
    }

    // Xử lý theo loại dịch
    switch (dichNgonNgu) {
        case 'tra-tu':
            document.getElementById('btnTra').classList.add("hidden");
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
                        hienThiKetQuaDich(result, tuTiengNhat.trim()); // Truyền thêm tuTiengNhat
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

capNhatLichSuTimKiem();

export function handleBtnTraTuClick() {
    if (document.getElementById('dich-ngon-ngu').value == 'tra-tu') {
        return;
    }
    // 1. Ưu tiên cụm từ được bôi đen
    searchUtils.tuVungTimKiem = window.getSelection().toString().trim();
    const inputTuTiengNhat = document.getElementById('tuTiengNhat');

    // 2. Kiểm tra loại dịch nếu không có cụm từ được bôi đen
    if (searchUtils.tuVungTimKiem === "") {
        const dichNgonNgu = document.getElementById('dich-ngon-ngu').value;
        if (dichNgonNgu === 'jp-vn') {
            searchUtils.tuVungTimKiem = inputTuTiengNhat.value.trim();
        } else if (dichNgonNgu === 'vn-jp') {
            searchUtils.tuVungTimKiem = divKetQua.querySelector('span').textContent.trim();
        }
    }
    document.getElementById('dich-ngon-ngu').value = 'tra-tu';
    // 3. Thực hiện tra từ
    xuLyTimKiem(searchUtils.tuVungTimKiem, document.getElementById('dich-ngon-ngu').value);
}

document.getElementById("btnTra").addEventListener('click', handleBtnTraTuClick);

// Lấy phần tử dropdown 'dich-ngon-ngu'
const dichNgonNguSelect = document.getElementById('dich-ngon-ngu');
let dichNgonNguSelected = 'tra-tu';

// Thêm sự kiện 'change' cho dropdown
dichNgonNguSelect.addEventListener('change', () => {
    // 1. Kiểm tra xem có từ nào được chọn để dịch hay không
    if (document.getElementById("tuTiengNhat").value.trim() === "" && searchUtils.tuVungTimKiem === "" && divKetQua.textContent === "") {
        // Nếu không có, chỉ cập nhật dichNgonNguSelected và return
        dichNgonNguSelected = dichNgonNguSelect.value;
        return;
    }

    // 2. Xử lý ẩn/hiện nút "Tra từ"
    const btnTra = document.getElementById("btnTra");
    if (dichNgonNguSelect.value === 'tra-tu') {
        btnTra.classList.add("hidden");
    } else {
        btnTra.classList.remove("hidden");
    }

    // 3. Lấy từ cần dịch dựa trên loại dịch đã chọn (dichNgonNguSelect.value) và trạng thái hiện tại
    const inputTuTiengNhat = document.getElementById('tuTiengNhat');
    switch (dichNgonNguSelect.value) {
        case 'jp-vn':
            searchUtils.tuVungTimKiem = inputTuTiengNhat.value.trim();
            break;
        case 'vn-jp':
            // Ưu tiên lấy từ kết quả dịch, nếu không có thì lấy từ input
            searchUtils.tuVungTimKiem = divKetQua.querySelector('span')?.textContent.trim() || inputTuTiengNhat.value.trim();
            break;
        case 'tra-tu':
            // Giữ nguyên từ vựng tìm kiếm hiện tại
            break;
    }

    // 4. Cập nhật dichNgonNguSelected với giá trị mới
    dichNgonNguSelected = dichNgonNguSelect.value;

    // 5. Thực hiện tra từ với từ đã lấy và loại dịch mới
    xuLyTimKiem(searchUtils.tuVungTimKiem, dichNgonNguSelect.value);
});

export function downloadData() {
    let myData = localStorage.getItem('lichSuTimKiem');
    try {
        myData = JSON.parse(myData);
    } catch (error) {
        console.error("Error parsing data from localStorage:", error);
        // Handle the error appropriately, e.g., show an error message to the user
        alert("Lỗi khi tải xuống dữ liệu.");
        return; 
    }
    myData = JSON.stringify(myData, null, 2); // Use null, 2 for pretty printing

    let link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(myData);
    link.download = 'lichSuTimKiem.json';
    link.click();
}

export function importData(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            // Parse the JSON string into a JavaScript object
            const jsonData = JSON.parse(event.target.result);
            // Do something with the JSON data, like saving it to localStorage
            
            const mergedData = [];
            const existingTus = new Set();
            
            // Hàm kiểm tra "tu" đã tồn tại trong mảng mergedData hay chưa
            function tuDaTonTai(tu) {
              return existingTus.has(tu);
            }
            
            // Thêm dữ liệu từ jsonData vào mergedData, kiểm tra trùng "tu"
            jsonData.forEach(item => {
              if (!tuDaTonTai(item.tu)) {
                mergedData.push(item);
                existingTus.add(item.tu);
              }
            });
            
            // Thêm dữ liệu từ searchUtils.tuVungTimKiem vào mergedData, kiểm tra trùng "tu"
            [...searchUtils.tuVungTimKiem].forEach(item => {
              if (!tuDaTonTai(item.tu)) {
                mergedData.push(item);
                existingTus.add(item.tu);
              }
            });
            
            searchUtils.tuVungTimKiem = mergedData
            luuDuLieuVaoLocalStorage('lichSuTimKiem', mergedData);
            capNhatLichSuTimKiem();
        } catch (error) {
            alert("File không phải là JSON hợp lệ.");
        }
    };

    // Read the file as text
    reader.readAsText(file);
}
