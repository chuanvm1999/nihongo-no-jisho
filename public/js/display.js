import { 
    searchUtils,
    btnList,
    xuLyTimKiem
} from './fe.js';

import { 
    hienThiModalKanji 
} from './modal.js';

const divKetQua = document.getElementById('ketQua');

/**
 * Hiển thị kết quả tra cứu từ vựng.
 *
 * @param {object} data - Dữ liệu từ vựng từ API.
 */
export function hienThiKetQua(data) {
    // Cập nhật từ vựng tìm kiếm và vẽ Kanji.
    searchUtils.tuVungTimKiem = data.tu_tieng_nhat;
    drawKanji(searchUtils.tuVungTimKiem);

    // Tạo container cho kết quả.
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container', 'flex');

    // Cột trái: Thông tin từ vựng.
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('flex-grow');

    const h2 = document.createElement('h2');
    h2.textContent = `${data.tu_tieng_nhat} (${data.cach_doc})`;
    h2.classList.add('text-xl', 'font-semibold', 'mb-2', 'highlight');
    leftColumn.appendChild(h2);

    // Cột phải: Nút "Đọc" và "Kanji".
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('flex', 'items-center');

    const btnDoc = document.createElement('button');
    btnDoc.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    btnDoc.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'ml-2');
    btnDoc.id = 'btnDoc';
    btnDoc.addEventListener('click', () => {
        docCachDoc(data.cach_doc);
    });
    rightColumn.appendChild(btnDoc);

    // Lấy danh sách Kanji từ từ vựng.
    const kanjiList = [...new Set(data.tu_tieng_nhat.match(/[\u4e00-\u9faf]/g) || [])];

    if (kanjiList.length > 0) {
        const btnHienThiKanji = document.createElement('button');
        btnHienThiKanji.textContent = 'Kanji';
        btnHienThiKanji.classList.add(
            'px-4', 'py-2', 'bg-gray-500', 'hover:bg-gray-600',
            'text-white', 'font-bold', 'rounded-md', 'ml-2'
        );
        btnHienThiKanji.addEventListener('click', () => {
            hienThiModalKanji(kanjiList);
        });
        btnHienThiKanji.id = 'btnHienThiKanji';
        rightColumn.appendChild(btnHienThiKanji);
    }

    resultsContainer.appendChild(leftColumn);
    resultsContainer.appendChild(rightColumn);

    // Tạo các phần tử hiển thị thông tin từ vựng.
    const createInfoElement = (label, content, className) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${label}:</strong> ${content}`;
        p.classList.add('mb-4', className);
        return p;
    };

    divKetQua.innerHTML = ''; // Xóa nội dung cũ
    divKetQua.appendChild(resultsContainer);
    divKetQua.appendChild(createInfoElement('Hán Việt', data.am_han_viet));
    divKetQua.appendChild(createInfoElement('Nghĩa tiếng Việt', data.nghia_tieng_viet));
    divKetQua.appendChild(createInfoElement('Giải thích tiếng Việt', data.giai_thich[0].giai_thich_tieng_viet));
    divKetQua.appendChild(createInfoElement('Giải thích tiếng Nhật', data.giai_thich[0].giai_thich_tieng_nhat));
    divKetQua.appendChild(createInfoElement('Phiên âm Hiragana', data.giai_thich[0].phien_am_hiragana));

    if (data.vi_du) {
        divKetQua.appendChild(createInfoElement('Ví dụ', `${data.vi_du.vi_du_tieng_viet}<br><strong>Ví dụ:</strong> ${data.vi_du.vi_du_tieng_nhat}`, 'font-italic'));
    }

    // Hiển thị danh sách từ vựng liên quan.
    hienThiDanhSachTuVung(data);
    divKetQua.style.display = 'block';
}

/**
 * Hiển thị danh sách từ vựng liên quan.
 *
 * @param {object} data - Dữ liệu từ vựng từ API.
 */
export function hienThiDanhSachTuVung(data) {
    const danhSachTuVungDiv = document.getElementById('danhSachTuVung');
    danhSachTuVungDiv.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('table-auto', 'w-full');
    danhSachTuVungDiv.appendChild(table);

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['STT', 'Từ vựng', 'Cách đọc', 'Ý nghĩa'].forEach(headerText => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.classList.add('py-3', 'px-6', 'text-left', 'bg-gray-200', 'text-gray-600', 'uppercase', 'text-sm', 'leading-normal');
    });

    const tbody = table.createTBody();
    tbody.classList.add('text-gray-800', 'text-sm', 'font-light');

    data.giai_thich[0].danh_sach_tat_ca_tu_vung.forEach((tuVung, index) => {
        const row = tbody.insertRow();
        row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

        const createTableCell = (content, className) => {
            const cell = row.insertCell();
            cell.textContent = content;
            cell.classList.add('py-3', 'px-6', 'text-left', className);
            return cell;
        };

        createTableCell(index + 1, 'whitespace-nowrap');
        const tuVungCell = createTableCell(tuVung.tu_vung, 'cursor-pointer');
        tuVungCell.addEventListener('click', () => xuLyTimKiem(tuVung.tu_vung));
        createTableCell(tuVung.cach_doc);
        createTableCell(tuVung.y_nghia);
    });

    danhSachTuVungDiv.style.display = 'block';
}

/**
 * Vẽ Kanji với Dmak.js và xử lý các nút điều khiển.
 *
 * @param {string} kanji - Ký tự Kanji cần vẽ.
 */
export function drawKanji(kanji) {
    const kanjiSvg = document.getElementById('kanjiSvg');
    kanjiSvg.innerHTML = '';
    kanjiSvg.style.display = 'flex';
    document.getElementById('btn-draw-list').style.display = 'flex';

    const { play, stop, next, back, reset } = btnList;
    const p = document.getElementById(back);
    const s = document.getElementById(stop);
    const g = document.getElementById(play);
    const n = document.getElementById(next);
    const r = document.getElementById(reset);

    const dmak = new Dmak(kanji, {
        'element': 'kanjiSvg',
        'uri': 'https://kanjivg.tagaini.net/kanjivg/kanji/'
    });

    dmak.render();

    p.onclick = () => { dmak.pause(); dmak.eraseLastStrokes(1); };
    s.onclick = () => dmak.pause();
    g.onclick = () => dmak.render();
    n.onclick = () => { dmak.pause(); dmak.renderNextStrokes(1); };
    r.onclick = () => { dmak.pause(); dmak.erase(); };
}

/**
 * Đọc cách đọc của từ vựng.
 *
 * @param {string} text - Cách đọc của từ vựng.
 */
export function docCachDoc(text) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        synth.speak(utterance);
    } else {
        alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.');
    }
}
