import {
    danhDauDaHienThiHuongDan,
    downloadData,
    importData 
} from './fe.js';

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
        'max-w-xl', 'w-full', 'h-full', 'md:w-3/4',
        'flex', 'flex-col'
    );
    content.innerHTML = `
        <div class="flex flex-col items-center mb-4">
            <h2 class="text-xl font-bold">Hướng dẫn sử dụng trang web</h2>
        </div>
        <div class="overflow-y-auto flex-grow p-4">
            <p class="mb-4">Chào mừng bạn đến với trang web tra cứu từ điển tiếng Nhật!</p>
            <ul class="list-disc list-inside mb-4 pl-5">
                ${[
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
        ].map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="mt-4 flex justify-end">
            <button id="btnXuatFile" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md mr-2">Xuất file</button>
            <input type="file" id="inputFile" accept=".json" hidden/>
            <button id="btnNhapFile" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md mr-2">Nhập file</button>
            <button id="dongModalHuongDan" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md">Đóng</button>
        </div>
    `;

    // Lắng nghe sự kiện click cho nút đóng
    content.querySelector('#dongModalHuongDan').addEventListener('click', () => {
        document.body.removeChild(modal);
        danhDauDaHienThiHuongDan();
    });

    // Lắng nghe sự kiện click cho nút xuất file
    content.querySelector('#btnXuatFile').addEventListener('click', () => {
        downloadData();
    });

    // Lắng nghe sự kiện click cho nút nhập file
    const inputFile = content.querySelector('#inputFile');
    content.querySelector('#btnNhapFile').addEventListener('click', () => {
        inputFile.click();
    });

    inputFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file.type === 'application/json') {
            importData(file);
        } else {
            alert('Vui lòng chọn file JSON.');
            inputFile.value = ''; // Xóa file đã chọn khỏi input
        }
        document.body.removeChild(modal);
    });
    

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


// Hàm hiển thị một hộp thoại prompt tùy chỉnh với giao diện HTML.
//
// @param {string} message - Thông báo hiển thị trong hộp thoại.
// @returns {Promise<string|null>} - Promise trả về API key nếu người dùng nhập, ngược lại trả về null.
export function htmlPrompt(message) {
    return new Promise((resolve) => {
        // Tương tự như trên, ta có thể tạo nội dung HTML cho modal một lần duy nhất
        const modal = document.createElement('div');
        modal.classList.add(
            'fixed', 'top-0', 'left-0', 'w-full', 'h-full',
            'bg-black', 'bg-opacity-50', 'flex', 'items-center',
            'justify-center', 'z-10'
        );
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <p class="font-bold mb-4">${message}</p>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-500 underline mb-4 block">Lấy API key tại đây</a>
                <input type="text" id="htmlPromptInput" class="w-full p-2 border border-gray-300 rounded-md mb-4">
                <div class="flex justify-end">
                    <button id="htmlPromptCancel" class="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-md">Hủy</button>
                    <button id="htmlPromptOK" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md">OK</button>
                </div>
            </div>
        `;

        // Lắng nghe sự kiện click cho các nút bấm
        modal.querySelector('#htmlPromptCancel').addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(null);
        });
        modal.querySelector('#htmlPromptOK').addEventListener('click', () => {
            const value = modal.querySelector('#htmlPromptInput').value;
            document.body.removeChild(modal);
            resolve(value);
        });

        document.body.appendChild(modal);
    });
}

// Hàm hiển thị modal chứa danh sách Kanji
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
        'max-w-xl', 'w-full', 'h-full', 'md:w-3/4',
        'flex', 'flex-col'
    );

    // Tạo header modal (chứa danh sách Kanji có thể scroll ngang)
    const header = document.createElement('div');
    header.classList.add('flex', 'flex-col', 'items-center', 'mb-4');

    const kanjiListHeader = document.createElement('ul');
    kanjiListHeader.classList.add('flex', 'space-x-4', 'whitespace-nowrap');

    // Duyệt qua danh sách Kanji và tạo các nút bấm tương ứng
    kanjiList.forEach((kanji, index) => {
        const kanjiData = kanjiDataJSON.find((k) => k.kanji === kanji);
        if (kanjiData) {
            const kanjiItem = document.createElement('li');
            kanjiItem.classList.add(
                'px-4', 'py-2', 'bg-gray-300', 'hover:bg-gray-400',
                'text-gray-800', 'font-bold', 'rounded-md', 'cursor-pointer',
                'transition', 'duration-200', 'ease-in-out', 'transform'
            );
            kanjiItem.textContent = kanjiData.kanji;

            // Thêm sự kiện click cho nút Kanji
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
    body.id = 'kanjiInfo';

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
    // Sử dụng template literals để tạo nội dung HTML động
    column1.innerHTML = `
        <p><strong>Nghĩa:</strong> ${kanjiData.mean.join(", ")}</p>
        ${kanjiData.on ? `<p><strong>Onyomi:</strong>  ${kanjiData.on.join(", ")}</p>` : ""}
        ${kanjiData.kun ? `<p><strong>Kunyomi:</strong>  ${kanjiData.kun.join(", ")}</p>` : ""}
    `;
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
    detailContainer.classList.add('p-4');

    // Thêm tiêu đề cho phần giải thích
    const detailTitle = document.createElement('h3');
    detailTitle.textContent = 'Giải thích chi tiết';
    detailTitle.classList.add('text-lg', 'font-bold', 'mb-4');
    detailContainer.appendChild(detailTitle);

    // Tách detail thành các phần dựa trên "##"
    const detailParts = kanjiData.detail.split('##');

    // Tạo HTML cho detail với định dạng đẹp hơn
    // Sử dụng map và join để tạo nội dung HTML từ mảng detailParts
    const detailHTML = detailParts
        .map((part) => `<h4 class="font-semibold">- ${part.trim()}</h4>`)
        .join('');

    detailContainer.innerHTML += detailHTML;
    container.appendChild(detailContainer);
}
