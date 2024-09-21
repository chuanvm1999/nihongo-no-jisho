import { 
    capNhatLichSuTimKiem,
} from './history.js';

import { 
    searchUtils,
} from './fe.js';

import { 
    htmlPrompt, 
} from './modal.js';

/**
 * Lưu dữ liệu vào localStorage
 * @param {string} key - Khóa của dữ liệu
 * @param {any} value - Giá trị của dữ liệu
 */
export function luuDuLieuVaoLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} key - Khóa của dữ liệu
 * @returns {any} - Giá trị của dữ liệu, hoặc null nếu không tìm thấy
 */
export function layDuLieuTuLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

/**
 * Xóa dữ liệu từ localStorage
 * @param {string} key - Khóa của dữ liệu cần xóa
 */
export function xoaDuLieuLocalStorage(key) {
    // Tìm kiếm vị trí của từ trong mảng lịch sử tìm kiếm
    const index = searchUtils.lichSuTimKiemData.findIndex(item => item.tu === key);

    // Nếu tìm thấy từ
    if (index > -1) {
        // Xóa từ khỏi mảng
        searchUtils.lichSuTimKiemData.splice(index, 1);

        // Lưu lại mảng lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', searchUtils.lichSuTimKiemData);

        // Cập nhật lại danh sách lịch sử tìm kiếm trên giao diện
        capNhatLichSuTimKiem();
    }
}

/**
 * Lấy API key từ localStorage. Nếu chưa có, hiển thị prompt yêu cầu người dùng nhập.
 * @returns {Promise<string>} - Promise trả về API key.
 */
export async function layAPIKeyTuLocalStorage() {
    const storedApiKey = localStorage.getItem('apiKey');

    if (storedApiKey) {
        return storedApiKey;
    } 

    // Hiển thị prompt yêu cầu người dùng nhập API key
    const apiKey = await htmlPrompt('Vui lòng nhập API key của bạn:'); 

    if (apiKey) {
        localStorage.setItem('apiKey', apiKey);
        return apiKey;
    } else {
        // Gọi lại hàm nếu người dùng không nhập API key
        return await layAPIKeyTuLocalStorage(); 
    }
}
