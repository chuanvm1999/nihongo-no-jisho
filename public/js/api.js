import { 
    xuLyTimKiem,
    searchUtils,
    modelUltis
} from './fe.js';

import { 
    luuDuLieuVaoLocalStorage, 
    layDuLieuTuLocalStorage, 
} from './data.js';

import { 
    hienThiKetQua, 
} from './display.js';

import { 
    capNhatLichSuTimKiem,
} from './history.js';

// Lấy các phần tử HTML cần thiết
const inputTuTiengNhat = document.getElementById('tuTiengNhat');
const searchCol = document.getElementById('search-col');
const overlay = document.getElementById('overlay');

/**
 * Gọi API để lấy dữ liệu từ vựng
 * @param {string} tuTiengNhat - Từ tiếng Nhật cần tìm kiếm
 */
export async function goiAPI(tuTiengNhat) {
    // Ẩn kết quả, danh sách từ vựng, Kanji và nút điều khiển trước khi gọi API
    document.getElementById('ketQua').style.display = 'none';
    document.getElementById('danhSachTuVung').style.display = 'none';
    document.getElementById('kanjiSvg').style.display = 'none';
    document.getElementById('btn-draw-list').style.display = 'none';

    // Vô hiệu hóa input
    inputTuTiengNhat.disabled = true;

    // Hiển thị lớp phủ
    overlay.classList.add('active');

    try {
        hienThiLoading(); // Hiển thị loading

        // Tạo prompt cho mô hình AI
        const prompt = `Mục đích và Mục tiêu:
            * Nhận một cụm từ hoặc từ vựng tiếng Nhật từ người dùng.
            * Giải thích rõ ràng, đơn giản và ngắn gọn từ vựng hoặc cụm từ đó bằng tiếng Nhật, phù hợp với trình độ N5.
            * Cung cấp bản dịch tiếng Việt của lời giải thích.
            * Trả về kết quả dưới dạng một đoạn tiếng Việt và một bảng gồm 4 cột: 
                - Cột 1: Từ vựng hoặc cụm từ
                - Cột 2: Cách đọc
                - Cột 3: Giải thích bằng tiếng Nhật
                - Cột 4: Giải thích bằng tiếng Việt
            
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
                        "phien_am_hiragana": "<phiên_âm_hiragana_viết_bằng_hiragana>",
                        "giai_thich_tieng_viet": "<giải_thích_bằng_tiếng_Việt>"
                        "danh_sach_tat_ca_tu_vung":[
                            {
                                "tu_vung": "<từ_vựng_trong_giải_thích>",
                                "cach_doc":"<cách_đọc_của_từ_vựng_trong_giải_thích>",
                                "y_nghia":"<ý_nghĩa_của_từ_vựng_trong_giải_thích>"
                            }
                        ]
                    }
                ],
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
            * Giải thích từ cần giải thích trong chuyên ngành công nghệ thông tin
        `;

        // Gọi API và lấy kết quả
        const result = await modelUltis.model.generateContent(prompt);
        const data = JSON.parse(result.response.text().replace("```json\n", "").replace("\n```", ""));

        // Thêm dữ liệu vào lịch sử tìm kiếm
        searchUtils.lichSuTimKiemData.push({ tu: tuTiengNhat, data: data });

        // Lưu lịch sử tìm kiếm vào localStorage
        luuDuLieuVaoLocalStorage('lichSuTimKiem', searchUtils.lichSuTimKiemData);

        hienThiKetQua(data); // Hiển thị kết quả
        capNhatLichSuTimKiem(); // Cập nhật lịch sử tìm kiếm trên giao diện
    } catch (error) {
        // Xử lý lỗi khi gọi API
        const message = `Gặp lỗi "${error}" trong quá trình tra từ "${tuTiengNhat}". Bạn có muốn dịch từ "${tuTiengNhat}" sang tiếng Việt?`;
        if (confirm(message)) {
            document.getElementById('dich-ngon-ngu').value = 'jp-vn';
            xuLyTimKiem(tuTiengNhat, 'jp-vn'); // Dịch sang tiếng Việt nếu người dùng đồng ý
        } else {
            // Thử gọi API lại sau 1 giây
            setTimeout(() => {
                goiAPI(tuTiengNhat); 
            }, 1000);
        }
    } finally {
        anLoading(); // Ẩn loading
        inputTuTiengNhat.disabled = false; // Bật lại input
        overlay.classList.remove('active'); // Ẩn lớp phủ
    }
}

/**
 * Hiển thị loading
 */
export function hienThiLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

/**
 * Ẩn loading
 */
export function anLoading() {
    document.getElementById('loading').classList.add('hidden');
    searchCol.style.display = 'block';
}

/**
 * Dịch văn bản sử dụng Google Translate API
 * @param {string} vanBan - Văn bản cần dịch
 * @param {boolean} typeTrans - Loại dịch (true: Nhật -> Việt, false: Việt -> Nhật)
 * @returns {Promise<object|null>} - Đối tượng chứa kết quả dịch và cách đọc (nếu có), hoặc null nếu có lỗi
 */
export async function dichVanBan(vanBan, typeTrans) {
    try {
        const tl = typeTrans ? 'vi' : 'ja'; // Mã ngôn ngữ đích
        const sl = typeTrans ? 'ja' : 'vi'; // Mã ngôn ngữ nguồn

        // Tạo URL API Google Translate
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(vanBan)}`;

        // Nếu dịch từ tiếng Việt sang tiếng Nhật, thêm tham số dt=t để lấy phiên âm
        if (!typeTrans) {
            url += '&dt=t';
        }

        // Gọi API và lấy kết quả
        const response = await axios.get(url);
        const data = response.data;

        // Kiểm tra dữ liệu trả về
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            let ketQuaDich = data[0][0][0];
            let cachDoc = '';

            // Lấy cách đọc (phiên âm)
            if (!typeTrans && data[1] && data[1][0] && data[1][0][1]) {
                cachDoc = data[1][0][1]; // Lấy từ kết quả dịch
            } else if (typeTrans) { 
                cachDoc = layDuLieuTuLocalStorage('lichSuTimKiem').find(item => item.tu === vanBan)?.data.cach_doc || ''; // Lấy từ lịch sử tìm kiếm
            }

            return { ketQuaDich, cachDoc };
        } else {
            throw new Error('Lỗi khi dịch văn bản.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        return null;
    }
}
