import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy các phần tử HTML cần thiết
export const btnTraTu = document.getElementById('btnTraTu'); // Nút "Tra từ"
export const btnLamMoi = document.getElementById('btnLamMoi'); // Nút "Làm mới"
export const inputTuTiengNhat = document.getElementById('tuTiengNhat'); // Ô input nhập từ tiếng Nhật
export const divKetQua = document.getElementById('ketQua'); // Phần tử div hiển thị kết quả
export const lichSuTimKiem = document.getElementById('lichSuTimKiem'); // Phần tử ul hiển thị lịch sử tìm kiếm
export const btnMazii = document.getElementById('btn-mazii'); // Phần tử ul hiển thị lịch sử tìm kiếm
export const searchCol = document.getElementById('search-col'); // Phần tử ul hiển thị lịch sử tìm kiếm

// Fetch your API_KEY
export const API_KEY = await layAPIKeyTuLocalStorage();
let genAI = new GoogleGenerativeAI(API_KEY);
let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Danh sách ID của các nút điều khiển cho phần vẽ Kanji
export const btnList = {
    play: "btn-draw-p",
    stop: "btn-draw-s",
    next: "btn-draw-n",
    back: "btn-draw-b",
    reset: "btn-draw-r",
};

// Biến lưu trữ từ vựng đang được tìm kiếm 
export let tuVungTimKiem;

// Lấy lịch sử tìm kiếm từ localStorage hoặc khởi tạo mảng rỗng nếu chưa có
export let lichSuTimKiemData = layDuLieuTuLocalStorage('lichSuTimKiem') || [];

// Kiểm tra xem đã hiển thị hướng dẫn hay chưa
export function daHienThiHuongDan() {
    return localStorage.getItem('daHienThiHuongDan') === 'true';
}

export function danhDauDaHienThiHuongDan() {
    localStorage.setItem('daHienThiHuongDan', 'true');
}

// Hàm hiển thị modal hướng dẫn
export function hienThiModalHuongDan() {
    // Tạo modal
    const modal = document.createElement('div');
    modal.classList.add(
        'fixed', 'top-0', 'left-0', 'w-full', 'h-full',
        'bg-black', 'bg-opacity-50', 'flex', 'items-center',
        'justify-center', 'z-10'
    );

    // Tạo nội dung modal
    const content = document.createElement('div');
    content.classList.add(
        'bg-white', 'p-6', 'rounded-lg', 'shadow-lg',
        'max-w-xl', 'w-full', 'h-full', 'md:w-3/4', // Class responsive cho modal
        'flex', 'flex-col'
    );

    // Tạo header modal
    const header = document.createElement('div');
    header.classList.add('flex', 'flex-col', 'items-center', 'mb-4');

    const title = document.createElement('h2');
    title.classList.add('text-xl', 'font-bold');
    title.textContent = 'Hướng dẫn sử dụng trang web';
    header.appendChild(title);

    content.appendChild(header);

    // Tạo phần body modal (hiển thị nội dung hướng dẫn)
    const body = document.createElement('div');
    body.classList.add('overflow-y-auto', 'flex-grow', 'p-4');

    const intro = document.createElement('p');
    intro.classList.add('mb-4');
    intro.textContent = 'Chào mừng bạn đến với trang web tra cứu từ điển tiếng Nhật!';
    body.appendChild(intro);

    const list = document.createElement('ul');
    list.classList.add('list-disc', 'list-inside', 'mb-4', 'pl-5');

    const huongDanItems = [
        'Nhập từ tiếng Nhật vào ô tìm kiếm và nhấn Enter hoặc nút "Tra từ" để tra từ vựng.',
        'Bôi đen từ tiếng Nhật và nhấn nút "s" để tìm kiếm từ.',
        'Bôi đen từ tiếng Nhật và nhấn nút "d" để vẽ từ tiếng Nhật.',
        'Bôi đen từ tiếng Nhật và nhấn nút "l" để nghe từ tiếng Nhật.',
        'Bôi đen từ tiếng Nhật và nhấn nút "k" để hiển thị thông tin của chữ Kanji.',
        'Nhấn nút <strong>Kanji</strong> để hiển thị thông tin của chữ Kanji đang được tra từ.',
        'Nhấn nút <strong><i class="fa-solid fa-volume-high"></i></strong> để nghe từ tiếng Nhật.',
        'Nhấn nút <strong>Làm mới</strong> hoặc nhấn Shift + Enter để xóa kết quả tìm kiếm hiện tại và tìm kiếm lại.',
        'Nhấn nút <strong><i class="fas fa-cog"></i></strong> để cập nhật API key của bạn.',
        'Nhấn nút <strong>Mazii</strong> để chuyển đến trang Mazii.net với từ vựng được tìm kiếm.',
        'Nhấn nút <strong>Flip Card</strong> để chuyển đến trang flipcard với từ danh sách từ vựng đã được tìm kiếm và hiển thị theo dạng Flip Card.',
        'Sử dụng các nút điều khiển để xem cách viết từ được tra từ.',
        'Nhấn vào từ vựng tại phần lịch sử để hiển thị lại từ vựng đã tìm kiếm.'
    ];

    huongDanItems.forEach(itemText => {
        const listItem = document.createElement('li');
        listItem.innerHTML = itemText;
        list.appendChild(listItem);
    });

    body.appendChild(list);
    content.appendChild(body);

    // Tạo footer modal (chứa nút đóng)
    const footer = document.createElement('div');
    footer.classList.add('mt-4', 'flex', 'justify-end');

    const closeButton = document.createElement('button');
    closeButton.id = 'dongModalHuongDan';
    closeButton.classList.add(
        'px-4', 'py-2', 'bg-blue-500', 'hover:bg-blue-600',
        'text-white', 'font-bold', 'rounded-md'
    );
    closeButton.textContent = 'Đóng';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        danhDauDaHienThiHuongDan();
    });
    footer.appendChild(closeButton);

    content.appendChild(footer);

    // Thêm sự kiện click vào modal
    modal.addEventListener('click', (event) => {
        // Kiểm tra xem click có nằm trong content hay không
        if (!content.contains(event.target)) {
            document.body.removeChild(modal);
        }
    });

    modal.appendChild(content);
    document.body.appendChild(modal);
}



// Trong file public/js/fe.js, thêm hàm sau vào vị trí phù hợp (ví dụ: sau hàm htmlPrompt):
export function thayDoiAPIKey() {
    searchCol.style.display = 'none';
    htmlPrompt('Nhập API key mới:')
        .then(newApiKey => {
            if (newApiKey) {
                localStorage.setItem('apiKey', newApiKey);
                // Khởi tạo lại đối tượng Google Generative AI với API key mới
                genAI = new GoogleGenerativeAI(newApiKey);
                model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                // Hiển thị thông báo cho người dùng
                alert('API key đã được cập nhật!');
            }
            searchCol.style.display = 'block';
        });
}

export function layAPIKeyTuLocalStorage() {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
        return storedApiKey;
    } else {
        return htmlPrompt('Vui lòng nhập API key của bạn:')
            .then(apiKey => {
                if (apiKey) {
                    localStorage.setItem('apiKey', apiKey);
                    return apiKey;
                } else {
                    return layAPIKeyTuLocalStorage(); // Gọi lại hàm nếu người dùng không nhập API key
                }
            });
    }
}

/**
 * Hiển thị một hộp thoại prompt tùy chỉnh với giao diện HTML.
 *
 * @param {string} message - Thông báo hiển thị trong hộp thoại.
 * @returns {Promise<string|null>} - Promise trả về API key nếu người dùng nhập, ngược lại trả về null.
 */
export function htmlPrompt(message) {
    return new Promise((resolve) => {
        // Tạo một phần tử div để chứa hộp thoại
        const modal = document.createElement('div');
        modal.classList.add(
            'fixed',
            'top-0',
            'left-0',
            'w-full',
            'h-full',
            'bg-black',
            'bg-opacity-50',
            'flex',
            'items-center',
            'justify-center',
            'z-10'
        );

        // Tạo nội dung của hộp thoại
        const content = document.createElement('div');
        content.classList.add(
            'bg-white',
            'p-6',
            'rounded-lg',
            'shadow-lg',
            'text-center'
        );

        // Thông báo
        const messageElement = document.createElement('p');
        messageElement.classList.add('font-bold', 'mb-4');
        messageElement.textContent = message;
        content.appendChild(messageElement);

        // Liên kết
        const linkElement = document.createElement('a');
        linkElement.href = 'https://aistudio.google.com/app/apikey';
        linkElement.target = '_blank';
        linkElement.classList.add('text-blue-500', 'underline', 'mb-4', 'block');
        linkElement.textContent = 'Lấy API key tại đây';
        content.appendChild(linkElement);

        // Input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'htmlPromptInput';
        input.classList.add(
            'w-full',
            'p-2',
            'border',
            'border-gray-300',
            'rounded-md',
            'mb-4'
        );
        content.appendChild(input);

        // Nút bấm
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('flex', 'justify-end');

        const cancelButton = document.createElement('button');
        cancelButton.id = 'htmlPromptCancel';
        cancelButton.classList.add(
            'px-4',
            'py-2',
            'mr-2',
            'bg-gray-300',
            'hover:bg-gray-400',
            'text-gray-800',
            'font-bold',
            'rounded-md'
        );
        cancelButton.textContent = 'Hủy';
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(null);
        });
        buttonContainer.appendChild(cancelButton);

        const okButton = document.createElement('button');
        okButton.id = 'htmlPromptOK';
        okButton.classList.add(
            'px-4',
            'py-2',
            'bg-blue-500',
            'hover:bg-blue-600',
            'text-white',
            'font-bold',
            'rounded-md'
        );
        okButton.textContent = 'OK';
        okButton.addEventListener('click', () => {
            const value = input.value;
            document.body.removeChild(modal);
            resolve(value);
        });
        buttonContainer.appendChild(okButton);

        content.appendChild(buttonContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);
    });
}

/**
 * Xử lý tìm kiếm từ vựng
 * @param {string} tuTiengNhat - Từ tiếng Nhật cần tìm kiếm
 * @param {string} dichNgonNgu - Loại dịch ('tra-tu', 'jp-vn', 'vn-jp'), mặc định là 'tra-tu'
 */
export function xuLyTimKiem(tuTiengNhat, dichNgonNgu = 'tra-tu') {
    dichNgonNgu = dichNgonNgu || document.getElementById('dich-ngon-ngu').value;

    // Hàm kiểm tra xem chuỗi có phải tiếng Nhật hay không
    const isJapanese = (str) => !/[!#$%^&*()+=\[\]{};':"\\|,.<>\/?]/g.test(str) && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g.test(str);

    // Hàm hiển thị kết quả dịch
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

    if (dichNgonNgu === 'tra-tu') {
        const data = lichSuTimKiemData.find(item => item.tu === tuTiengNhat)?.data;
        if (data) {
            hienThiKetQua(data);
            return;
        }
        goiAPI(tuTiengNhat.trim());
    } else if (dichNgonNgu === 'jp-vn' || dichNgonNgu === 'vn-jp') {
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
    }
}

export function hienThiDanhSachTuVung(data) {
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
        tuVungCell.classList.add('py-3', 'px-6', 'text-left', 'cursor-pointer');
        tuVungCell.addEventListener('click', () => xuLyTimKiem(tuVung.tu_vung));


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
export async function goiAPI(tuTiengNhat) {
    // Ẩn kết quả và danh sách từ vựng trước khi gọi API
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
        if (confirm(`Gặp lỗi "${error}" trong quá trình tra từ "${tuTiengNhat}". Bạn có muốn dịch từ "${tuTiengNhat}" sang tiếng Việt?`)) {
            document.getElementById('dich-ngon-ngu').value = 'jp-vn';
            xuLyTimKiem(tuTiengNhat, 'jp-vn'); // Gọi hàm xuLyTimKiem với dichNgonNgu là 'jp-vn'
        } else {
            setTimeout(() => {
                goiAPI(tuTiengNhat); // Thử gọi API lại
            }, 1000);
        }

        return;
    } finally {
        anLoading(); // Ẩn loading

        // Bật lại input
        inputTuTiengNhat.disabled = false;

        // Ẩn lớp phủ sau khi API trả về kết quả
        overlay.classList.remove('active');
    }
}

/**
 * Hiển thị kết quả tìm kiếm
 * @param {object} data - Dữ liệu từ vựng
 */
export function hienThiKetQua(data) {
    tuVungTimKiem = data.tu_tieng_nhat; // Lưu trữ từ vựng đang được hiển thị
    drawKanji(tuVungTimKiem); // Gọi hàm vẽ Kanji
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container', 'flex'); // Thêm class 'flex' để sử dụng flexbox

    // Tạo container cho cột bên trái
    const leftColumn = document.createElement('div');
    leftColumn.classList.add('flex-grow'); // Cho phép cột trái co giãn theo nội dung

    // Tạo các phần tử HTML cho kết quả
    const h2 = document.createElement('h2');
    h2.textContent = `${data.tu_tieng_nhat} (${data.cach_doc})`;
    h2.classList.add('text-xl', 'font-semibold', 'mb-2', 'highlight');
    leftColumn.appendChild(h2); // Thêm h2 vào cột trái

    // Tạo container cho cột bên phải
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('flex', 'items-center'); // Căn giữa các phần tử trong cột phải

    // Add the button here
    const btnDoc = document.createElement('button');
    btnDoc.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    btnDoc.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'ml-2');
    btnDoc.id = 'btnDoc';

    btnDoc.addEventListener('click', () => {
        docCachDoc(data.cach_doc);
    });

    // Lấy danh sách Kanji từ từ vựng
    const kanjiList = [...new Set(data.tu_tieng_nhat.match(/[\u4e00-\u9faf]/g) || [])];

    if (kanjiList.length > 0) {
        // Tạo nút "Hiển thị Kanji"
        const btnHienThiKanji = document.createElement('button');
        btnHienThiKanji.textContent = 'Kanji';
        btnHienThiKanji.classList.add(
            'px-4', 'py-2', 'bg-gray-500', 'hover:bg-gray-600',
            'text-white', 'font-bold', 'rounded-md', 'ml-2' // Thêm margin trái
        );
        btnHienThiKanji.addEventListener('click', () => {
            hienThiModalKanji(kanjiList);
        });
        btnHienThiKanji.id = 'btnHienThiKanji';
        rightColumn.appendChild(btnHienThiKanji);

    }

    // Thêm btnDoc và btnHienThiKanji vào cột phải
    rightColumn.appendChild(btnDoc);

    // Thêm 2 cột vào container chính
    resultsContainer.appendChild(leftColumn);
    resultsContainer.appendChild(rightColumn);
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


    divKetQua.appendChild(resultsContainer);
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
    // Xóa nội dung hiện tại của lịch sử tìm kiếm
    lichSuTimKiem.innerHTML = '';

    // Kiểm tra kích thước màn hình để quyết định hiển thị table hay dropdown
    if (window.innerWidth <= 768) { // Giả sử 768px là điểm breakpoint cho thiết bị di động
        hienThiDropdownLichSu();
    } else {
        hienThiTableLichSu();
    }
}

function hienThiTableLichSu() {
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

function hienThiDropdownLichSu() {
    // Tạo dropdown
    const select = document.createElement('select');
    select.classList.add('w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md');
    lichSuTimKiem.appendChild(select);

    // Thêm option mặc định
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Lịch sử tìm kiếm';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Thêm dữ liệu lịch sử tìm kiếm vào dropdown
    [...lichSuTimKiemData].reverse().forEach(item => {
        const option = document.createElement('option');
        option.value = item.tu;
        option.text = `${item.tu} (${item.data.cach_doc}) - ${item.data.nghia_tieng_viet}`;
        select.appendChild(option);
    });

    // Xử lý sự kiện khi chọn option
    select.addEventListener('change', () => {
        const tuVung = select.value;
        hienThiTuDaTimKiem(tuVung);

        // Hiển thị nút xóa sau khi chọn từ
        hienThiNutXoa(tuVung);
    });
}

// Hàm hiển thị nút xóa
function hienThiNutXoa(tuVung) {
    // Tìm nút xóa nếu đã tồn tại
    let deleteButton = lichSuTimKiem.querySelector('.delete-button');

    // Nếu nút xóa chưa tồn tại, tạo mới
    if (!deleteButton) {
        deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa từ đang chọn';
        deleteButton.classList.add('delete-button', 'mt-2', 'px-4', 'py-2', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'font-bold', 'rounded-md');
        lichSuTimKiem.appendChild(deleteButton);
    }

    // Thêm sự kiện click cho nút xóa
    deleteButton.onclick = () => {
        xoaTuKhoiLichSu(tuVung);
        // Ẩn nút xóa sau khi xóa từ
        deleteButton.style.display = 'none';
    };
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

        // Ẩn phần hiển thị thông tin từ vựng (divKetQua)
        divKetQua.style.display = 'none';

        // Ẩn phần hiển thị Kanji và các nút điều khiển
        document.getElementById('kanjiSvg').style.display = 'none';
        document.getElementById('btn-draw-list').style.display = 'none';
        document.getElementById('danhSachTuVung').style.display = 'none';
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
 * Lưu dữ liệu vào localStorage
 * @param {string} name - Tên của dữ liệu
 * @param {any} value - Giá trị của dữ liệu
 */
export function luuDuLieuVaoLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} name - Tên của dữ liệu
 * @returns {any} - Giá trị của dữ liệu
 */
export function layDuLieuTuLocalStorage(name) {
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
export function xoaDuLieuLocalStorage(name) {
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
export function drawKanji(kanji) {
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

export function docCachDoc(text) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // Set language to Japanese
        utterance.rate = 0.8;
        synth.speak(utterance);
    } else {
        alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.');
    }
}

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
            event.preventDefault(); // Ngăn chặn hành vi mặc định của phím S
            tuVungTimKiem = window.getSelection().toString() ? window.getSelection().toString() : tuVungTimKiem; // Lấy từ vựng từ đoạn văn bản được chọn
            xuLyTimKiem(tuVungTimKiem);
            document.getElementById('dich-ngon-ngu').value = 'jp-vn';
        }

        if (event.key === 'd') {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của phím D
            const selectedText = window.getSelection().toString(); // Lấy đoạn văn bản được chọn
            if (selectedText) {
                drawKanji(selectedText); // Gọi hàm vẽ Kanji với đoạn văn bản được chọn
            }
        }

        if (event.key === 'l') {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của phím L
            const selectedText = window.getSelection().toString(); // Lấy đoạn văn bản được chọn
            docCachDoc(selectedText);
        }

        if (event.key === 'k') {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của phím L
            const selectedText = window.getSelection().toString(); // Lấy đoạn văn bản được chọn
            const kanjiList = [...new Set(selectedText.match(/[\u4e00-\u9faf]/g) || [])];
            hienThiModalKanji(kanjiList);
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
    xuLyTimKiem(tuTiengNhat, document.getElementById('dich-ngon-ngu').value); // Gọi hàm xử lý tìm kiếm
});

/**
 * Xử lý sự kiện click cho nút "Làm mới"
 */
btnLamMoi.addEventListener('click', () => {
    const tuTiengNhat = tuVungTimKiem; // Lấy từ tiếng Nhật từ biến lưu trữ hoặc input
    const dichNgonNgu = document.getElementById('dich-ngon-ngu').value;
    if (dichNgonNgu == 'tra-tu') {
        xoaDuLieuLocalStorage(tuTiengNhat); // Xóa dữ liệu từ localStorage
    }
    xuLyTimKiem(tuTiengNhat, dichNgonNgu); // Gọi hàm xử lý tìm kiếm
});

document.getElementById("btnThayDoiAPIKey").addEventListener("click", thayDoiAPIKey)

// Thêm sự kiện click cho nút btnSearch
document.getElementById("btn-flip-card").addEventListener('click', () => {
    // Chuyển hướng đến trang index.html
    window.location.href = 'flip-card.html';
});

// Cập nhật lịch sử tìm kiếm khi trang được tải
capNhatLichSuTimKiem();

async function dichVanBan(vanBan, typeTrans) {
    try {
        const tl = typeTrans ? 'vi' : 'ja';
        const sl = typeTrans ? 'ja' : 'vi';
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(vanBan)}`;

        // Nếu dịch từ tiếng Việt sang tiếng Nhật, thêm tham số dt=t để lấy phiên âm
        if (!typeTrans) {
            url += '&dt=t';
        }

        const response = await axios.get(url);
        const data = response.data;

        if (data && data[0] && data[0][0] && data[0][0][0]) {
            let ketQuaDich = data[0][0][0];
            let cachDoc = '';

            // Nếu dịch từ tiếng Việt sang tiếng Nhật, lấy phiên âm từ data[1]
            if (!typeTrans && data[1] && data[1][0] && data[1][0][1]) {
                cachDoc = data[1][0][1];
            } else if (typeTrans) { // Nếu dịch từ tiếng Nhật sang tiếng Việt, cách đọc là của phần cần dịch
                cachDoc = layDuLieuTuLocalStorage('lichSuTimKiem').find(item => item.tu === vanBan)?.data.cach_doc || '';
                console.log(cachDoc)
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

export function hienThiModalKanji(kanjiList) {
    // Tạo modal
    const modal = document.createElement('div');
    modal.classList.add(
        'fixed', 'top-0', 'left-0', 'w-full', 'h-full',
        'bg-black', 'bg-opacity-50', 'flex', 'items-center',
        'justify-center', 'z-10'
    );
    modal.id = 'modalLichSuTimKiem';

    // Tạo nội dung modal
    const content = document.createElement('div');
    content.classList.add(
        'bg-white', 'p-6', 'rounded-lg', 'shadow-lg',
        'max-w-xl', 'w-full', 'h-full', 'md:w-3/4', // Thêm class responsive cho modal
        'flex', 'flex-col'
    );

    // Tạo header modal (chứa danh sách Kanji có thể scroll ngang)
    const header = document.createElement('div');
    header.classList.add('flex', 'flex-col', 'items-center', 'mb-4'); // Thêm flex-col và items-center

    const kanjiListHeader = document.createElement('ul');
    kanjiListHeader.classList.add('flex', 'space-x-4', 'whitespace-nowrap');

    kanjiList.forEach((kanji, index) => { // Thêm index vào forEach
        const kanjiData = kanjiDataJSON.find((k) => k.kanji === kanji);
        if (kanjiData) {
            const kanjiItem = document.createElement('li');
            kanjiItem.classList.add('px-4', 'py-2', 'bg-gray-300', 'hover:bg-gray-400',
                'text-gray-800', 'font-bold', 'rounded-md', 'cursor-pointer',
                'transition', 'duration-200', 'ease-in-out', 'transform'); // Thêm class transition
            kanjiItem.textContent = kanjiData.kanji;
            kanjiItem.addEventListener('click', () => {
                hienThiThongTinKanji(kanjiData);

                // Loại bỏ lớp 'active' khỏi tất cả các nút
                const kanjiItems = kanjiListHeader.querySelectorAll('li');
                kanjiItems.forEach(item => item.classList.remove('btn-active'));

                // Thêm lớp 'active' vào nút được chọn
                kanjiItem.classList.add('btn-active');
            });

            // Thêm lớp 'active' cho nút đầu tiên
            if (index === 0) {
                kanjiItem.classList.add('btn-active');
            }

            kanjiListHeader.appendChild(kanjiItem);
        }
    });

    header.appendChild(kanjiListHeader);
    content.appendChild(header);

    // Tạo phần body modal (hiển thị thông tin Kanji)
    const body = document.createElement('div');
    body.classList.add('overflow-y-auto', 'flex-grow', 'p-4');
    body.id = 'kanjiInfo'; // Thêm ID để dễ dàng truy cập và cập nhật nội dung

    content.appendChild(body);

    // Nút đóng modal
    const closeButton = document.createElement('button');
    closeButton.classList.add(
        'px-4', 'py-2', 'bg-blue-500', 'hover:bg-blue-600',
        'text-white', 'font-bold', 'rounded-md', 'mt-4'
    );
    closeButton.textContent = 'Đóng';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    content.appendChild(closeButton);

    // Thêm sự kiện click vào modal
    modal.addEventListener('click', (event) => {
        // Kiểm tra xem click có nằm trong content hay không
        if (!content.contains(event.target)) {
            document.body.removeChild(modal);
        }
    });

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Hiển thị thông tin Kanji đầu tiên khi modal được mở
    if (kanjiList.length > 0) {
        const kanjiData = kanjiDataJSON.find((k) => k.kanji === kanjiList[0]);
        hienThiThongTinKanji(kanjiData);
    }
}

// Hàm hiển thị thông tin Kanji
function hienThiThongTinKanji(kanjiData) {
    const kanjiInfo = document.getElementById('kanjiInfo');
    kanjiInfo.innerHTML = ''; // Xóa nội dung cũ

    // Tạo container chính với flexbox, chia thành 3 hàng
    const container = document.createElement('div');
    container.classList.add('flex', 'flex-col', 'h-full');
    kanjiInfo.appendChild(container);

    // Phần 1: Iframe (chiếm 1/3 chiều cao)
    const iframeContainer = document.createElement('div');
    // iframeContainer.classList.add('h-2/5');
    const kanji = kanjiData.kanji;
    const iframe = document.createElement('iframe');
    iframe.src = `https://chuanvm1999.github.io/nihongo-no-jisho/iframe/index.html?data=${encodeURIComponent(kanji)}`;
    iframe.width = '100%';
    iframe.height = '225px';
    iframeContainer.appendChild(iframe);
    container.appendChild(iframeContainer);

    // Phần 2: Thông tin Kanji (chiếm 1/3 chiều cao, chia 2 cột)
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('flex', 'px-4', 'mb-3');
    container.appendChild(infoContainer);

    // Cột 1: Nghĩa, Âm Hán, Âm Cổ
    const column1 = document.createElement('div');
    column1.classList.add('w-1/2');
    column1.innerHTML = `
        <p><strong>Nghĩa:</strong> ${kanjiData.mean.join(", ")}</p>
    `;

    column1.innerHTML += kanjiData.on ? `<p><strong>Onyomi:</strong>  ${kanjiData.on.join(", ")}</p>` : "";
    column1.innerHTML += kanjiData.kun ? `<p><strong>Kunyomi:</strong>  ${kanjiData.kun.join(", ")}</p>` : "";
    infoContainer.appendChild(column1);

    // Cột 2: Số nét, JLPT
    const column2 = document.createElement('div');
    column2.classList.add('w-1/2');
    column2.innerHTML = `
        <p><strong>Số nét:</strong> ${kanjiData.stroke_count}</p>
        <p><strong>JLPT:</strong> ${kanjiData.level.join(", ")}</p>
    `;
    infoContainer.appendChild(column2);

    // Phần 3: Giải thích (chiếm 1/3 chiều cao, cho phép scroll dọc)
    const detailContainer = document.createElement('div');
    detailContainer.classList.add('overflow-y-auto', 'p-4');

    // Thêm tiêu đề cho phần giải thích
    const detailTitle = document.createElement('h3');
    detailTitle.textContent = 'Giải thích chi tiết';
    detailTitle.classList.add('text-lg', 'font-bold', 'mb-4');
    container.appendChild(detailTitle);

    // Tách detail thành các phần dựa trên "##"
    const detailParts = kanjiData.detail.split('##');

    // Tạo HTML cho detail với định dạng đẹp hơn
    let detailHTML = '';
    detailParts.forEach((part, index) => {
        detailHTML += `<h4 class="font-semibold">- ${part.trim()}</h4>`;
    });

    detailContainer.innerHTML += detailHTML; // Thêm detailHTML sau tiêu đề
    container.appendChild(detailContainer);
}