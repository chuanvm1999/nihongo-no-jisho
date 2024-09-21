const flashcardContainer = document.getElementById('flashcard-container');
const amHanVietElement = document.getElementById('am-han-viet');
const nghiaHanVietElement = document.getElementById('nghia-han-viet');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnFlip = document.getElementById('btnFlip');
const btnToggleMode = document.getElementById('btnToggleMode');
const answerWrap = document.getElementById('answer-wrap');
const kanjiSvgWrap = document.getElementById('kanjiSvg-wrap');
const btnSearch = document.getElementById('btnSearch');
const helpButton = document.getElementById('btnHuongDan');

const amDocHTML = `<span class="am-doc font-bold" id="am-doc"></span>`;
const kanjiSvgHTML = `<div class="kanji-svg-container flex items-center justify-center"><div id="kanjiSvg" class="kanji-svg flex flex-wrap  justify-center "></div></div>`;

let flipCard = document.querySelector('.flip-card');
let currentDisplayMode = 'kanji'; // Hiển thị kanji mặc định

// Lấy dữ liệu từ localStorage. 
let lichSuTimKiemData = JSON.parse(localStorage.getItem('lichSuTimKiem')) || [];
var danhSachTuVungDaLuu = JSON.parse(localStorage.getItem('tuVungDuocChon')) ? JSON.parse(localStorage.getItem('tuVungDuocChon')) : lichSuTimKiemData.length > 0 ? lichSuTimKiemData : [];

let currentCardIndex = 0;
let previousCardIndexes = [];





// Kiểm tra xem có dữ liệu hay không
if (danhSachTuVungDaLuu.length > 0) {
    updateFlashcardContent(danhSachTuVungDaLuu[currentCardIndex].data);
} else if(lichSuTimKiemData.length > 0){
    localStorage.setItem('tuVungDuocChon', JSON.stringify(lichSuTimKiemData));
} else {
    flashcardContainer.style.display = 'none';
    alert("Không có dữ liệu. Vui lòng thêm từ vựng vào lịch sử tìm kiếm.");
    window.location.href = 'index.html';

}

// Hàm lấy index ngẫu nhiên, khác index hiện tại
function getRandomIndex(currentIndex) {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * danhSachTuVungDaLuu.length);
    } while (newIndex === currentIndex && danhSachTuVungDaLuu.length > 1);
    return newIndex;
}

// Hàm cập nhật nội dung flashcard
function updateFlashcardContent(data) {
    if (currentDisplayMode === 'kanji') {
        answerWrap.innerHTML = amDocHTML;
        kanjiSvgWrap.innerHTML = kanjiSvgHTML;
        drawKanji(data.tu_tieng_nhat);
    } else if (currentDisplayMode === 'cachdoc') {
        answerWrap.innerHTML = kanjiSvgHTML;
        kanjiSvgWrap.innerHTML = amDocHTML;
        drawKanji(data.tu_tieng_nhat);
    }

    const amDocElement = document.getElementById('am-doc');
    amDocElement.textContent = data.cach_doc;
    amHanVietElement.textContent = data.am_han_viet;
    nghiaHanVietElement.textContent = data.nghia_tieng_viet;
}

// Xử lý sự kiện
flashcardContainer.addEventListener('click', () => {
    flipCard.classList.toggle('flipped');
});

btnFlip.addEventListener('click', () => {
    flipCard.classList.toggle('flipped');
});

btnNext.addEventListener('click', () => {
    // Thêm index hiện tại vào đầu mảng previousCardIndexes
    previousCardIndexes.unshift(currentCardIndex);

    // Giới hạn số lượng index được lưu trữ (ví dụ: chỉ lưu 10 index gần nhất)
    if (previousCardIndexes.length > 10) {
        previousCardIndexes.pop();
    }

    currentCardIndex = getRandomIndex(currentCardIndex);
    updateFlashcardContent(danhSachTuVungDaLuu[currentCardIndex].data);
    flipCard.classList.remove('flipped');
});

btnPrev.addEventListener('click', () => {
    // Kiểm tra xem có index trước đó trong mảng hay không
    if (previousCardIndexes.length > 0) {
        // Lấy index từ đầu mảng và cập nhật currentCardIndex
        currentCardIndex = previousCardIndexes.shift();
        updateFlashcardContent(danhSachTuVungDaLuu[currentCardIndex].data);
        flipCard.classList.remove('flipped');
    }
});

btnToggleMode.addEventListener('click', () => {
    currentDisplayMode = currentDisplayMode === 'kanji' ? 'cachdoc' : 'kanji';
    btnToggleMode.innerHTML = currentDisplayMode === 'kanji' ? '<i class="fa-solid fa-arrow-right-arrow-left"></i> Kanji' : '<i class="fa-solid fa-arrow-right-arrow-left"></i> Cách đọc';

    // Hiển thị ngẫu nhiên từ vựng mới
    currentCardIndex = getRandomIndex(currentCardIndex);
    updateFlashcardContent(danhSachTuVungDaLuu[currentCardIndex].data);

    flipCard.classList.remove('flipped'); // Reset trạng thái lật thẻ
});

// Thêm sự kiện click cho nút btnSearch
btnSearch.addEventListener('click', () => {
    // Chuyển hướng đến trang index.html
    window.location.href = 'index.html';
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        btnNext.click();
    } else if (event.key === 'ArrowLeft') {
        btnPrev.click();
    } else if (event.code === 'Space') {
        event.preventDefault();
        btnFlip.click();
    } else if (event.key === 'Tab') {
        btnToggleMode.click();
    }
});

function drawKanji(kanji) {
    document.getElementById('kanjiSvg').innerHTML = '';
    const dmak = new Dmak(kanji, {
        'element': 'kanjiSvg',
        'uri': 'https://kanjivg.tagaini.net/kanjivg/kanji/'
    });
    dmak.render();
}

helpButton.addEventListener('click', () => {
    hienThiModalHuongDan();
});


function hienThiModalHuongDan() {
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
        'max-w-md'
    );

    // Tiêu đề hướng dẫn
    const title = document.createElement('h2');
    title.classList.add('text-xl', 'font-bold', 'mb-4');
    title.textContent = 'Hướng dẫn sử dụng trang web';
    content.appendChild(title);

    // Nội dung giới thiệu
    const intro = document.createElement('p');
    intro.classList.add('mb-4');
    intro.textContent = 'Chào mừng bạn đến với trang web tra cứu từ điển tiếng Nhật!';
    content.appendChild(intro);

    // Danh sách hướng dẫn
    const list = document.createElement('ul');
    list.classList.add('list-disc', 'list-inside', 'mb-4', 'pl-5'); // Thêm pl-5 để thụt đầu dòng

    const huongDanItems = [
        'Nhấn nút "<i class="fas fa-angles-right"></i>" hoặc nhấn mũi tên tương ứng trên bàn phím để hiển thị từ vựng mới.',
        'Nhấn nút "<i class="fas fa-angles-left"></i>" hoặc nhấn mũi tên tương ứng trên bàn phím để hiển thị từ vựng vừa qua.',
        'Nhấn nút "<i class="fas fa-arrows-rotate"></i>" hoặc nhấn phím Space để lật thẻ.',
        'Nhấn nút "<i class="fa-solid fa-arrow-right-arrow-left"></i> Kanji" hoặc nhấn phím Tab để thay đổi chế độ hiển thị.',
        'Nhấn nút "<i class="fa-solid fa-magnifying-glass"></i>" để mở trang tìm kiếm từ vựng.',
    ];

    huongDanItems.forEach(itemText => {
        const listItem = document.createElement('li');
        listItem.innerHTML = itemText;
        list.appendChild(listItem);
    });

    content.appendChild(list);

    // Nút đóng modal
    const closeButton = document.createElement('button');
    closeButton.id = 'dongModalHuongDan';
    closeButton.classList.add(
        'px-4',
        'py-2',
        'bg-blue-500',
        'hover:bg-blue-600',
        'text-white',
        'font-bold',
        'rounded-md',
        'flex', // Thêm class 'flex'
        'justify-end' // Thêm class 'justify-end'
    );
    closeButton.textContent = 'Đóng';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        danhDauDaHienThiHuongDan(); // Đánh dấu đã hiển thị hướng dẫn
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
}

// Kiểm tra xem đã hiển thị hướng dẫn hay chưa
function daHienThiHuongDan() {
    return localStorage.getItem('daHienThiHuongDanFlipCard') === 'true';
}

// Đánh dấu đã hiển thị hướng dẫn
function danhDauDaHienThiHuongDan() {
    localStorage.setItem('daHienThiHuongDanFlipCard', 'true');
}

// Kiểm tra xem có phải lần đầu tiên truy cập trang web hay không
if (!daHienThiHuongDan()) {
    hienThiModalHuongDan();
}