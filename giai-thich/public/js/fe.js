import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy các phần tử HTML cần thiết
const btnTraTu = document.getElementById('btnTraTu'); // Nút "Tra từ"
const btnLamMoi = document.getElementById('btnLamMoi'); // Nút "Làm mới"
const inputTuTiengNhat = document.getElementById('tuTiengNhat'); // Ô input nhập từ tiếng Nhật
const divKetQua = document.getElementById('ketQua'); // Phần tử div hiển thị kết quả
const lichSuTimKiem = document.getElementById('lichSuTimKiem'); // Phần tử ul hiển thị lịch sử tìm kiếm
const btnMazii = document.getElementById('btn-mazii'); // Phần tử ul hiển thị lịch sử tìm kiếm

// Danh sách ID của các nút điều khiển cho phần vẽ Kanji
const btnList = {
    play: "btn-draw-p",
    stop: "btn-draw-s",
    next: "btn-draw-n",
    back: "btn-draw-b",
    reset: "btn-draw-r",
};

// Biến lưu trữ từ vựng đang được tìm kiếm
let tuVungTimKiem;

// Lấy lịch sử tìm kiếm từ localStorage hoặc khởi tạo mảng rỗng nếu chưa có
let lichSuTimKiemData = layDuLieuTuLocalStorage('lichSuTimKiem') || [];

/**
 * Xử lý tìm kiếm từ vựng
 * @param {string} tuTiengNhat - Từ tiếng Nhật cần tìm kiếm
 */
function xuLyTimKiem(tuTiengNhat) {
    // Tìm kiếm dữ liệu từ trong lịch sử tìm kiếm
    const data = lichSuTimKiemData.find(item => item.tu === tuTiengNhat)?.data;
    if (data) {
        hienThiKetQua(data); // Hiển thị kết quả nếu tìm thấy trong lịch sử
        return;
    }
    goiAPI(tuTiengNhat); // Gọi API nếu không tìm thấy trong lịch sử
}

function hienThiDanhSachTuVung(data) {
    // Xóa nội dung hiện tại của bảng danh sách từ vựng
    const danhSachTuVungDiv = document.getElementById('danhSachTuVung');
    danhSachTuVungDiv.innerHTML = '';

    // Tạo bảng mới
    const table = document.createElement('table');
    table.classList.add('table-auto', 'w-full');
    danhSachTuVungDiv.appendChild(table);

    // Tạo phần header của bảng
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['STT', 'Từ vựng', 'Cách đọc', 'Ý nghĩa'].forEach(headerText => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.classList.add('py-3', 'px-6', 'text-left', 'bg-gray-200', 'text-gray-600', 'uppercase', 'text-sm', 'leading-normal');
    });

    // Tạo phần thân bảng
    const tbody = table.createTBody();
    tbody.classList.add('text-gray-800', 'text-sm', 'font-light');

    // Thêm dữ liệu từ vựng vào bảng
    data.giai_thich[0].danh_sach_tat_ca_tu_vung.forEach((tuVung, index) => {
        const row = tbody.insertRow();
        row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

        // Tạo các ô dữ liệu
        const sttCell = row.insertCell();
        sttCell.textContent = index + 1;
        sttCell.classList.add('py-3', 'px-6', 'text-left', 'whitespace-nowrap');

        const tuVungCell = row.insertCell();
        tuVungCell.textContent = tuVung.tu_vung;
        tuVungCell.classList.add('py-3', 'px-6', 'text-left');

        const cachDocCell = row.insertCell();
        cachDocCell.textContent = tuVung.cach_doc;
        cachDocCell.classList.add('py-3', 'px-6', 'text-left');

        const yNghiaCell = row.insertCell();
        yNghiaCell.textContent = tuVung.y_nghia;
        yNghiaCell.classList.add('py-3', 'px-6', 'text-left');
    });

    // Hiển thị bảng danh sách từ vựng
    danhSachTuVungDiv.style.display = 'block';
}

/**
 * Gọi API để lấy dữ liệu từ vựng
 * @param {string} tuTiengNhat - Từ tiếng Nhật cần tìm kiếm
 */
async function goiAPI(tuTiengNhat) {
    // Ẩn kết quả và danh sách từ vựng trước khi gọi API
    document.getElementById('ketQua').style.display = 'none';
    document.getElementById('danhSachTuVung').style.display = 'none';
    document.getElementById('kanjiSvg').style.display = 'none';
    document.getElementById('btn-draw-list').style.display = 'none';

    try {
        hienThiLoading(); // Hiển thị loading
        // const response = await axios.get(`http://127.0.0.1:3000/gemini-data?tu=${tuTiengNhat}`); // Gọi API
        // const data = response.data; // Lấy dữ liệu từ response


        // Fetch your API_KEY
        const API_KEY = "AIzaSyDDYQkYgdCzI58jiyTjfAJnL5mKRLXVTmA";
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Mục đích và Mục tiêu:

        * Nhận một cụm từ hoặc từ vựng tiếng Nhật từ người dùng.
        
        * Giải thích rõ ràng, đơn giản và ngắn gọn từ vựng hoặc cụm từ đó bằng tiếng Nhật, phù hợp với trình độ N5.
        
        * Cung cấp bản dịch tiếng Việt của lời giải thích.
        
        * Trả về kết quả dưới dạng một đoạn tiếng Việt và một bảng gồm 4 cột: cột đầu tiên là từ vựng hoặc cụm từ, cột thứ hai là cách đọc, cột thứ ba là giải thích bằng tiếng Nhật, cột thứ tư là giải thích bằng tiếng Việt.
        
         Giải thích và dịch thuật cụm từ "${tuTiengNhat}":
        
        * Giải thích nghĩa của từ/cụm từ bằng tiếng Nhật đơn giản, dễ hiểu, ngắn gọn sử dụng từ vựng và ngữ pháp phù hợp với trình độ tiếng Nhật N5.
        
        * Cung cấp bản dịch tiếng Việt chính xác của lời giải thích.
        
        * Nếu từ/cụm từ có nhiều nghĩa, hãy giải thích tất cả các nghĩa phổ biến.
        
        * Nếu có thể, hãy đưa ra một vài ví dụ về cách sử dụng từ/cụm từ trong câu.
        
        * Trả về kết quả dưới dạng một đoạn JSON theo định dạng sau:
        
        {
              "tu_tieng_nhat": "<từ_tiếng_Nhật>",
              "cach_doc": "<cách_đọc>",
              "am_han_viet": "<âm_hán_việt>",
              "nghia_tieng_viet": "<nghĩa_tiếng_Việt>",
              "giai_thich":[
                {
                    "giai_thich_tieng_nhat": "<giải_thích_bằng_tiếng_Nhật>",
                    "phien_am_hiragana": "<phiên_âm_bằng_hiragana>",
                    "giai_thich_tieng_viet": "<giải_thích_bằng_tiếng_Việt>"
                    "danh_sach_tat_ca_tu_vung":[<danh_sách_tất_cả_từ_vựng_xuất_hiện_trong_giải_thích_bằng_tiếng_Nhật>
                        {
                            "tu_vung": "<từ_vựng_trong_giải_thích>",
                            "cach_doc":"<cách_đọc_của_từ_vựng_trong_giải_thích>",
                            "y_nghia":"<ý_nghĩa_của_từ_vựng_trong_giải_thích>"
                        }
                    ]
                }],
              "vi_du": {
                "vi_du_tieng_nhat":"<ví_dụ_minh_họa_nếu_có>",
                "vi_du_tieng_viet":"<ví_dụ_minh_họa_nếu_có>"
                        }
            }
              
        Lưu ý: 
        * Chỉ trả về JSON
        * Chỉ dụng ngữ pháp tiếng Nhật N5 căn bản
        * Không sử dụng từ cần giải thích trong câu giải thích
        * Có thể sử dụng từ đồng nghĩa với từ cần giải thích trong câu giải thích
        * Giải thích từ cần giải thích trong chuyên ngành công nghệ thông tin`;

        const result = await model.generateContent(prompt);

        const data = JSON.parse(result.response.text().replace("```json\n", "").replace("\n```", ""));

        // Thêm dữ liệu vào mảng lịch sử tìm kiếm
        lichSuTimKiemData.push({ tu: tuTiengNhat, data: data });

        // Lưu lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', lichSuTimKiemData);

        hienThiKetQua(data); // Hiển thị kết quả
        capNhatLichSuTimKiem(); // Cập nhật lịch sử tìm kiếm trên giao diện
    } catch (error) {
        console.error(error); // In lỗi ra console nếu có
        alert(error);
        setTimeout(() => {
            goiAPI(tuTiengNhat); // Thử gọi API lại
        }, 1000);
        return;
    } finally {
        anLoading(); // Ẩn loading
    }
}

/**
 * Hiển thị kết quả tìm kiếm
 * @param {object} data - Dữ liệu từ vựng
 */
function hienThiKetQua(data) {
    tuVungTimKiem = data.tu_tieng_nhat; // Lưu trữ từ vựng đang được hiển thị
    drawKanji(tuVungTimKiem); // Gọi hàm vẽ Kanji

    // Tạo các phần tử HTML cho kết quả
    const h2 = document.createElement('h2');
    h2.textContent = `${data.tu_tieng_nhat} (${data.cach_doc})`;
    h2.classList.add('text-xl', 'font-semibold', 'mb-2', 'highlight');

    const p1 = document.createElement('p');
    p1.innerHTML = `<strong>Hán Việt:</strong> ${data.am_han_viet}`;
    p1.classList.add('mb-4');

    const p2 = document.createElement('p');
    p2.innerHTML = `<strong>Nghĩa tiếng Việt:</strong>  ${data.nghia_tieng_viet}`;
    p2.classList.add('mb-4');

    const p3 = document.createElement('p');
    p3.innerHTML = `<strong>Giải thích tiếng Việt:</strong> ${data.giai_thich[0].giai_thich_tieng_viet}`;
    p3.classList.add('mb-4');

    const p4 = document.createElement('p');
    p4.innerHTML = `<strong>Giải thích tiếng Nhật:</strong> ${data.giai_thich[0].giai_thich_tieng_nhat}`;
    p4.classList.add('mb-4');

    const p5 = document.createElement('p');
    p5.innerHTML = `<strong>Phiên âm Hiragana:</strong> ${data.giai_thich[0].phien_am_hiragana}`;
    p5.classList.add('mb-4');

    const p6 = document.createElement('p');
    if (data.vi_du) {
        p6.innerHTML = `<strong>Ví dụ:</strong> ${data.vi_du.vi_du_tieng_viet}<br><strong>Ví dụ:</strong> ${data.vi_du.vi_du_tieng_nhat}`;
        p6.classList.add('font-italic');
    }

    // Xóa nội dung hiện tại của divKetQua
    divKetQua.innerHTML = '';

    // Thêm các phần tử HTML vào divKetQua
    divKetQua.appendChild(h2);
    divKetQua.appendChild(p1);
    divKetQua.appendChild(p2);
    divKetQua.appendChild(p3);
    divKetQua.appendChild(p4);
    divKetQua.appendChild(p5);
    divKetQua.appendChild(p6);

    // Hiển thị danh sách từ vựng trong bảng
    hienThiDanhSachTuVung(data);

    // Hiển thị divKetQua
    divKetQua.style.display = 'block';
}


/**
 * Cập nhật danh sách lịch sử tìm kiếm trên giao diện
 */
export function capNhatLichSuTimKiem() {
    // Xóa nội dung hiện tại của bảng lịch sử tìm kiếm
    lichSuTimKiem.innerHTML = '';

    // Tạo bảng mới
    const table = document.createElement('table');
    table.classList.add('table-auto', 'w-full');
    lichSuTimKiem.appendChild(table);

    // Tạo phần header của bảng
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['Từ vựng', 'Cách đọc', 'Nghĩa tiếng Việt', 'Hành động'].forEach(headerText => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.classList.add('py-3', 'px-6', 'text-left', 'bg-gray-200', 'text-gray-600', 'uppercase', 'text-sm', 'leading-normal');
    });

    // Tạo phần thân bảng
    const tbody = table.createTBody();
    tbody.classList.add('text-gray-800', 'text-sm', 'font-light');

    // Thêm dữ liệu lịch sử tìm kiếm vào bảng
    [...lichSuTimKiemData].reverse().forEach((item, index) => {
        const row = tbody.insertRow();
        row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

        // Tạo các ô dữ liệu
        const tuCell = row.insertCell();
        tuCell.textContent = item.tu;
        tuCell.classList.add('py-3', 'px-6', 'text-left', 'cursor-pointer');
        tuCell.addEventListener('click', () => hienThiTuDaTimKiem(item.tu));

        const cachDocCell = row.insertCell();
        cachDocCell.textContent = item.data.cach_doc;
        cachDocCell.classList.add('py-3', 'px-6', 'text-left');

        const nghiaCell = row.insertCell();
        nghiaCell.textContent = item.data.nghia_tieng_viet;
        nghiaCell.classList.add('py-3', 'px-6', 'text-left');

        // Tạo ô hành động
        const hanhDongCell = row.insertCell();
        hanhDongCell.classList.add('py-3', 'px-6', 'text-center');

        const xoaSpan = document.createElement('span');
        xoaSpan.textContent = 'Xóa';
        xoaSpan.classList.add('text-red-500', 'cursor-pointer');
        xoaSpan.addEventListener('click', () => xoaTuKhoiLichSu(item.tu));
        hanhDongCell.appendChild(xoaSpan);
    });
}

/**
 * Xóa từ khỏi lịch sử tìm kiếm
 * @param {string} tu - Từ cần xóa
 */ 
export function xoaTuKhoiLichSu(tu) {
    // Tìm kiếm vị trí của từ trong mảng lịch sử tìm kiếm
    const index = lichSuTimKiemData.findIndex(item => item.tu === tu);
    if (index > -1) {
        // Xóa từ khỏi mảng
        lichSuTimKiemData.splice(index, 1);
        // Lưu lại lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', lichSuTimKiemData);
        // Cập nhật danh sách lịch sử tìm kiếm trên giao diện
        capNhatLichSuTimKiem();
    }
}

/**
 * Hiển thị thông tin từ đã tìm kiếm từ lịch sử
 * @param {string} tu - Từ cần hiển thị
 */
export function hienThiTuDaTimKiem(tu) {
    // Tìm kiếm dữ liệu từ trong lịch sử tìm kiếm
    const data = lichSuTimKiemData.find(item => item.tu === tu)?.data;
    if (data) {
        hienThiKetQua(data); // Hiển thị kết quả nếu tìm thấy
    }
}

/**
 * Hiển thị loading
 */
function hienThiLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

/**
 * Ẩn loading
 */
function anLoading() {
    document.getElementById('loading').classList.add('hidden');
}

/**
 * Lưu dữ liệu vào localStorage
 * @param {string} name - Tên của dữ liệu
 * @param {any} value - Giá trị của dữ liệu
 */
function luuDuLieuVaoLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} name - Tên của dữ liệu
 * @returns {any} - Giá trị của dữ liệu
 */
function layDuLieuTuLocalStorage(name) {
    const value = localStorage.getItem(name);
    if (value) {
        try {
            return JSON.parse(value);
        } catch (error) {
            console.error("Lỗi khi parse JSON từ localStorage:", error);
            return null;
        }
    }
    return null;
}

/**
 * Xóa dữ liệu từ localStorage
 * @param {string} name - Tên của dữ liệu cần xóa
 */
function xoaDuLieuLocalStorage(name) {
    // Tìm kiếm vị trí của từ trong mảng lịch sử tìm kiếm
    const index = lichSuTimKiemData.findIndex(item => item.tu === name);

    // Nếu tìm thấy từ
    if (index > -1) {
        // Xóa từ khỏi mảng
        lichSuTimKiemData.splice(index, 1);

        // Lưu lại mảng lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', lichSuTimKiemData);

        // Cập nhật lại danh sách lịch sử tìm kiếm trên giao diện
        capNhatLichSuTimKiem();
    }
}

/**
 * Vẽ Kanji
 * @param {string} kanji - Ký tự Kanji cần vẽ
 */
function drawKanji(kanji) {
    // Xóa nội dung hiện tại của div chứa Kanji
    const kanjiSvg = document.getElementById('kanjiSvg');
    kanjiSvg.innerHTML = '';

    // Hiển thị div chứa Kanji và các nút điều khiển
    kanjiSvg.style.display = 'flex';
    document.getElementById('btn-draw-list').style.display = 'flex';

    // Lấy các nút điều khiển
    var p = document.getElementById(btnList.back);
    var s = document.getElementById(btnList.stop);
    var g = document.getElementById(btnList.play);
    var n = document.getElementById(btnList.next);
    var r = document.getElementById(btnList.reset);

    // Khởi tạo đối tượng Dmak để vẽ Kanji
    const dmak = new Dmak(kanji, {
        'element': 'kanjiSvg', // ID của phần tử chứa Kanji
        'uri': 'https://kanjivg.tagaini.net/kanjivg/kanji/' // Đường dẫn đến file SVG của Kanji
    });

    dmak.render(); // Bắt đầu vẽ Kanji

    // Gán sự kiện click cho các nút điều khiển
    p.onclick = function () {
        dmak.pause(); // Tạm dừng vẽ
        dmak.eraseLastStrokes(1); // Xóa nét vẽ cuối cùng
    };
    s.onclick = function () {
        dmak.pause(); // Tạm dừng vẽ
    };
    g.onclick = function () {
        dmak.render(); // Tiếp tục vẽ
    };
    n.onclick = function () {
        dmak.pause(); // Tạm dừng vẽ
        dmak.renderNextStrokes(1); // Vẽ nét tiếp theo
    };
    r.onclick = function () {
        dmak.pause(); // Tạm dừng vẽ
        dmak.erase(); // Xóa toàn bộ nét vẽ
    };
}

btnMazii.addEventListener("click", () => {
    window.open("https://mazii.net/vi-VN/search/word/javi/" + encodeURIComponent(tuVungTimKiem));
})

// Ẩn kết quả, danh sách từ vựng, Kanji và các nút điều khiển khi trang được tải
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('ketQua').style.display = 'none';
    document.getElementById('danhSachTuVung').style.display = 'none';
    document.getElementById('kanjiSvg').style.display = 'none';
    document.getElementById('btn-draw-list').style.display = 'none';
});

/**
 * Xử lý sự kiện nhấn phím
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
        if (event.shiftKey) {
            btnLamMoi.click(); // Shift + Enter: Làm mới
        } else {
            btnTraTu.click(); // Enter: Tìm kiếm
        }
    }

    if (event.key === 's') {
        tuVungTimKiem = window.getSelection().toString(); // Lấy từ vựng từ đoạn văn bản được chọn
        btnTraTu.click(); // Tìm kiếm từ vựng
    }

    if (event.key === 'd') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím D
        const selectedText = window.getSelection().toString(); // Lấy đoạn văn bản được chọn
        if (selectedText) {
            drawKanji(selectedText); // Gọi hàm vẽ Kanji với đoạn văn bản được chọn
        }
    }
});

/**
 * Xử lý sự kiện click cho nút "Tra từ"
 */
btnTraTu.addEventListener('click', () => {
    tuVungTimKiem = inputTuTiengNhat.value.trim() ? inputTuTiengNhat.value : tuVungTimKiem;
    const tuTiengNhat = tuVungTimKiem; // Lấy từ tiếng Nhật từ input hoặc từ biến lưu trữ
    xuLyTimKiem(tuTiengNhat); // Gọi hàm xử lý tìm kiếm
});

/**
 * Xử lý sự kiện click cho nút "Làm mới"
 */
btnLamMoi.addEventListener('click', () => {
    const tuTiengNhat = tuVungTimKiem; // Lấy từ tiếng Nhật từ biến lưu trữ hoặc input
    xoaDuLieuLocalStorage(tuTiengNhat); // Xóa dữ liệu từ localStorage
    xuLyTimKiem(tuTiengNhat); // Gọi hàm xử lý tìm kiếm
});


// Cập nhật lịch sử tìm kiếm khi trang được tải
capNhatLichSuTimKiem();

