import { 
    btnTraTu, 
    btnLamMoi, 
    inputTuTiengNhat, 
    btnMazii,
    searchCol,
    tuVungTimKiem,
    daHienThiHuongDan,
    hienThiModalHuongDan,
    thayDoiAPIKey,
    xuLyTimKiem,
    capNhatLichSuTimKiem,
    xoaDuLieuLocalStorage,
    drawKanji
} from './functionModule.js';


// Lấy nút "?" từ DOM
const helpButton = document.getElementById('btnHuongDan');

// Thêm sự kiện click cho nút "?"
helpButton.addEventListener('click', () => {
    hienThiModalHuongDan();
});


btnMazii.addEventListener("click", () => {
    window.open("https://mazii.net/vi-VN/search/word/javi/" + encodeURIComponent(tuVungTimKiem));
})

// Ẩn kết quả, danh sách từ vựng, Kanji và các nút điều khiển khi trang được tải
document.addEventListener('DOMContentLoaded', (event) => {
    if (!daHienThiHuongDan()) {
        hienThiModalHuongDan();
    }

    document.getElementById('ketQua').style.display = 'none';
    document.getElementById('danhSachTuVung').style.display = 'none';
    document.getElementById('kanjiSvg').style.display = 'none';
    document.getElementById('btn-draw-list').style.display = 'none';
});

/**
 * Xử lý sự kiện nhấn phím
 */
document.addEventListener('keydown', (event) => {
    // Kiểm tra xem có đang gọi API hay không
    if (overlay.classList.contains('active')) {
        event.preventDefault(); // Ngăn chặn tất cả sự kiện bàn phím khi đang gọi API
        return; // Thoát khỏi hàm xử lý sự kiện
    }

    if (searchCol.style.display != 'hidden') {
        if (event.key === 's') {
            tuVungTimKiem = window.getSelection().toString() ? window.getSelection().toString() : tuVungTimKiem; // Lấy từ vựng từ đoạn văn bản được chọn
            btnTraTu.click(); // Tìm kiếm từ vựng
        }

        if (event.key === 'd') {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của phím D
            const selectedText = window.getSelection().toString(); // Lấy đoạn văn bản được chọn
            if (selectedText) {
                drawKanji(selectedText); // Gọi hàm vẽ Kanji với đoạn văn bản được chọn
            }
        }
    }

    // Đóng modal/prompt khi nhấn Esc
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.fixed.z-10'); // Chọn tất cả các modal/prompt đang mở
        if (modals.length > 0) {
            modals[modals.length - 1].remove(); // Đóng modal/prompt mới nhất
        }
    }

    // Xác nhận prompt khi nhấn Enter
    if (event.key === 'Enter' && document.getElementById('htmlPromptInput')) {
        document.getElementById('htmlPromptOK').click(); // Kích hoạt nút "OK" của prompt
    } else if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
        if (event.shiftKey) {
            btnLamMoi.click(); // Shift + Enter: Làm mới
        } else {
            btnTraTu.click(); // Enter: Tìm kiếm
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

document.getElementById("btnThayDoiAPIKey").addEventListener("click", thayDoiAPIKey)

// Thêm sự kiện click cho nút btnSearch
document.getElementById("btn-flip-card").addEventListener('click', () => {
    // Chuyển hướng đến trang index.html
    window.location.href = 'flip-card.html';
  });

// Cập nhật lịch sử tìm kiếm khi trang được tải
capNhatLichSuTimKiem();

