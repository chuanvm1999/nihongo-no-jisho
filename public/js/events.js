import { 
    searchUtils,
    xuLyTimKiem,
} from './fe.js';

import { 
    xoaDuLieuLocalStorage, 
} from './data.js';

import { 
    drawKanji,
    docCachDoc
} from './display.js';

import { 
    hienThiModalHuongDan, 
    hienThiModalKanji,
    htmlPrompt
} from './modal.js';

// Lấy các phần tử HTML cần thiết
const btnTraTu = document.getElementById('btnTraTu');
const btnLamMoi = document.getElementById('btnLamMoi');
const inputTuTiengNhat = document.getElementById('tuTiengNhat');
const searchCol = document.getElementById('search-col');
const overlay = document.getElementById('overlay');

/**
 * Kiểm tra xem đã hiển thị hướng dẫn hay chưa.
 * @returns {boolean} - True nếu đã hiển thị, false nếu chưa.
 */
export function daHienThiHuongDan() {
    return localStorage.getItem('daHienThiHuongDan') === 'true';
}

/**
 * Xử lý sự kiện click cho nút hướng dẫn.
 */
export function handleHelpButtonClick() {
    hienThiModalHuongDan();
}

/**
 * Xử lý sự kiện click cho nút Mazii.
 */
export function handleMaziiButtonClick() {
    window.open(`https://mazii.net/vi-VN/search/word/javi/${encodeURIComponent(searchUtils.tuVungTimKiem)}`);
}

/**
 * Xử lý sự kiện khi DOMContentLoaded.
 */
export function handleDOMContentLoaded() {
    if (!daHienThiHuongDan()) {
        hienThiModalHuongDan();
    }

    // Ẩn các phần tử kết quả ban đầu
    document.getElementById('ketQua').style.display = 'none';
    document.getElementById('danhSachTuVung').style.display = 'none';
    document.getElementById('kanjiSvg').style.display = 'none';
    document.getElementById('btn-draw-list').style.display = 'none';
}

/**
 * Xử lý sự kiện nhấn phím.
 * @param {KeyboardEvent} event - Sự kiện bàn phím.
 */
export function handleKeyDown(event) {
    // Ngăn chặn sự kiện bàn phím khi đang gọi API
    if (overlay.classList.contains('active')) {
        event.preventDefault();
        return;
    }

    if (searchCol.style.display !== 'hidden' && window.innerWidth > 768) {
        switch (event.key) {
            case 's':
                event.preventDefault();
                searchUtils.tuVungTimKiem = window.getSelection().toString() || searchUtils.tuVungTimKiem;
                xuLyTimKiem(searchUtils.tuVungTimKiem);
                document.getElementById('dich-ngon-ngu').value = 'jp-vn';
                break;
            case 'd':
                event.preventDefault();
                drawKanji(window.getSelection().toString());
                break;
            case 'l':
                event.preventDefault();
                docCachDoc(window.getSelection().toString());
                break;
            case 'k':
                event.preventDefault();
                const kanjiList = [...new Set(window.getSelection().toString().match(/[\u4e00-\u9faf]/g) || [])];
                hienThiModalKanji(kanjiList);
                break;
        }
    }

    // Đóng modal/prompt khi nhấn Esc
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.fixed.z-10');
        modals[modals.length - 1]?.remove();
    }

    // Xác nhận prompt khi nhấn Enter
    if (event.key === 'Enter') {
        event.preventDefault();
        if (document.getElementById('htmlPromptInput')) {
            document.getElementById('htmlPromptOK').click();
        } else if (event.shiftKey) {
            btnLamMoi.click(); // Shift + Enter: Làm mới
        } else {
            btnTraTu.click(); // Enter: Tìm kiếm
        }
    }
}

/**
 * Xử lý sự kiện click cho nút "Tra từ".
 */
export function handleTraTuClick() {
    searchUtils.tuVungTimKiem = inputTuTiengNhat.value.trim() || searchUtils.tuVungTimKiem;
    xuLyTimKiem(searchUtils.tuVungTimKiem, document.getElementById('dich-ngon-ngu').value);
}

/**
 * Xử lý sự kiện click cho nút "Làm mới".
 */
export function handleLamMoiClick() {
    const dichNgonNgu = document.getElementById('dich-ngon-ngu').value;
    if (dichNgonNgu === 'tra-tu') {
        xoaDuLieuLocalStorage(searchUtils.tuVungTimKiem);
    }
    xuLyTimKiem(searchUtils.tuVungTimKiem, dichNgonNgu);
}

/**
 * Xử lý sự kiện click cho nút "Flip Card".
 */
export function handleFlipCardClick() {
    window.location.href = 'flip-card.html';
}