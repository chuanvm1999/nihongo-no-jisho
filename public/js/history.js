import { GoogleGenerativeAI } from "@google/generative-ai";

import { 
    searchUtils,
    modelUltis
} from './fe.js';

import { 
    luuDuLieuVaoLocalStorage, 
} from './data.js';

import { 
    hienThiKetQua, 
} from './display.js';

import { 
    htmlPrompt, 
} from './modal.js';

// Lấy các phần tử HTML cần thiết
const divKetQua = document.getElementById('ketQua');
const lichSuTimKiem = document.getElementById('lichSuTimKiem');
const searchCol = document.getElementById('search-col');

/**
 * Cập nhật danh sách lịch sử tìm kiếm trên giao diện.
 */
export function capNhatLichSuTimKiem() {
    // Xóa nội dung hiện tại của lịch sử tìm kiếm
    lichSuTimKiem.innerHTML = '';

    // Hiển thị danh sách lịch sử dựa trên kích thước màn hình
    if (window.innerWidth <= 768) {
        hienThiDropdownLichSu();
    } else {
        hienThiTableLichSu();
    }
}

/**
 * Xóa từ khỏi lịch sử tìm kiếm.
 * @param {string} tu - Từ cần xóa.
 */
export function xoaTuKhoiLichSu(tu) {
    const index = searchUtils.lichSuTimKiemData.findIndex(item => item.tu === tu);

    if (index > -1) {
        // Xóa từ khỏi mảng lịch sử
        searchUtils.lichSuTimKiemData.splice(index, 1);

        // Lưu lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', searchUtils.lichSuTimKiemData);

        // Cập nhật danh sách lịch sử tìm kiếm trên giao diện
        capNhatLichSuTimKiem();

        // Ẩn kết quả, Kanji, danh sách từ vựng
        divKetQua.style.display = 'none';
        document.getElementById('kanjiSvg').style.display = 'none';
        document.getElementById('btn-draw-list').style.display = 'none';
        document.getElementById('danhSachTuVung').style.display = 'none';
    }
}

/**
 * Hiển thị thông tin từ đã tìm kiếm từ lịch sử.
 * @param {string} tu - Từ cần hiển thị.
 */
export function hienThiTuDaTimKiem(tu) {
    const data = searchUtils.lichSuTimKiemData.find(item => item.tu === tu)?.data;
    if (data) {
        hienThiKetQua(data);
    }
}

/**
 * Hiển thị lịch sử tìm kiếm dưới dạng bảng.
 */
function hienThiTableLichSu() {
    const table = document.createElement('table');
    table.classList.add('table-auto', 'w-full');
    lichSuTimKiem.appendChild(table);

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['Từ vựng', 'Cách đọc', 'Nghĩa tiếng Việt', 'Hành động'].forEach(headerText => {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = headerText;
        headerCell.classList.add(
            'py-3', 'px-6', 'text-left', 'bg-gray-200', 
            'text-gray-600', 'uppercase', 'text-sm', 'leading-normal'
        );
    });

    const tbody = table.createTBody();
    tbody.classList.add('text-gray-800', 'text-sm', 'font-light');

    [...searchUtils.lichSuTimKiemData].reverse().forEach(item => {
        const row = tbody.insertRow();
        row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

        // Tạo hàm rút gọn để tạo ô trong bảng
        const createTableCell = (content, className = '', onClick = null) => {
            const cell = row.insertCell();
            cell.textContent = content;
            cell.classList.add('py-3', 'px-6', 'text-left'); 
        
            if (className) {
                cell.classList.add(className);
            }
        
            if (onClick) {
                cell.classList.add('cursor-pointer');
                cell.addEventListener('click', onClick);
            }
            return cell;
        };
        

        createTableCell(item.tu, 'cursor-pointer', () => hienThiTuDaTimKiem(item.tu));
        createTableCell(item.data.cach_doc);
        createTableCell(item.data.nghia_tieng_viet);

        const hanhDongCell = createTableCell('');
        const xoaSpan = document.createElement('span');
        xoaSpan.textContent = 'Xóa';
        xoaSpan.classList.add('text-red-500', 'cursor-pointer');
        xoaSpan.addEventListener('click', () => xoaTuKhoiLichSu(item.tu));
        hanhDongCell.appendChild(xoaSpan);
    });
}

/**
 * Hiển thị lịch sử tìm kiếm dưới dạng dropdown.
 */
function hienThiDropdownLichSu() {
    const select = document.createElement('select');
    select.classList.add('w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md');
    lichSuTimKiem.appendChild(select);

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Lịch sử tìm kiếm';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    [...searchUtils.lichSuTimKiemData].reverse().forEach(item => {
        const option = document.createElement('option');
        option.value = item.tu;
        option.text = `${item.tu} (${item.data.cach_doc}) - ${item.data.nghia_tieng_viet}`;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        hienThiTuDaTimKiem(select.value);
        hienThiNutXoa(select.value);
    });
}

/**
 * Hiển thị nút xóa cho dropdown lịch sử.
 * @param {string} tuVung - Từ vựng cần xóa.
 */
function hienThiNutXoa(tuVung) {
    let deleteButton = lichSuTimKiem.querySelector('.delete-button');

    if (!deleteButton) {
        deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa từ đang chọn';
        deleteButton.classList.add(
            'delete-button', 'mt-2', 'px-4', 'py-2', 'bg-red-500', 
            'hover:bg-red-600', 'text-white', 'font-bold', 'rounded-md'
        );
        lichSuTimKiem.appendChild(deleteButton);
    }

    deleteButton.onclick = () => {
        xoaTuKhoiLichSu(tuVung);
        deleteButton.style.display = 'none';
    };
}

/**
 * Thay đổi API key.
 */
export function thayDoiAPIKey() {
    searchCol.style.display = 'none';
    htmlPrompt('Nhập API key mới:')
        .then(newApiKey => {
            if (newApiKey) {
                localStorage.setItem('apiKey', newApiKey);
                modelUltis.genAI = new GoogleGenerativeAI(newApiKey);
                alert('API key đã được cập nhật!');
            }
            searchCol.style.display = 'block';
        });
}
