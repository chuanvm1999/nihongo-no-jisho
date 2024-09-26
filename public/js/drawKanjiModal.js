// Hàm để hiển thị modal
function openDrawKanjiModal() {
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        document.getElementById("iframe-draw-wrapper-mobile").style.display = "block";
    } else {
        document.getElementById("drawKanjiModal").style.display = "block";
    }
}

// Hàm để đóng modal
function closeDrawKanjiModal() {
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        document.getElementById("iframe-draw-wrapper-mobile").style.display = "none";
    } else {
        document.getElementById("drawKanjiModal").style.display = "none";
    }
}

// Cho phép di chuyển modal bằng cách kéo chuột
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('drawKanjiModal');
    const modalHeader = document.querySelector('.modal-header');
    let isDragging = false;
    let offsetX, offsetY;

    // Sự kiện bắt đầu chạm cho thiết bị cảm ứng
    modalHeader.addEventListener('touchstart', function (e) {
        isDragging = true;
        const touch = e.touches[0]; // Lấy điểm chạm đầu tiên
        offsetX = touch.clientX - modal.offsetLeft;
        offsetY = touch.clientY - modal.offsetTop;
    });

    // Sự kiện di chuyển chạm
    document.addEventListener('touchmove', function (e) {
        if (isDragging) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
            const touch = e.touches[0];
            modal.style.left = (touch.clientX - offsetX) + 'px';
            modal.style.top = (touch.clientY - offsetY) + 'px';
        }
    });

    // Sự kiện kết thúc chạm
    document.addEventListener('touchend', function () {
        isDragging = false;
    });

    modalHeader.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modal.style.left = (e.clientX - offsetX) + 'px';
            modal.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
});

window.onload = function () {
    const iframeWrapperMobile = document.getElementById('iframe-draw-wrapper-mobile');
    const iframeWrapperWeb = document.querySelector('.modal-content');

    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.src = 'http://127.0.0.1:5501/iframe/drawKanji.html';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.id = 'iframe-draw-kanji';

    // Check screen size and append iframe to the appropriate wrapper
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        iframeWrapperMobile.appendChild(iframe);
    } else {
        iframeWrapperWeb.appendChild(iframe);
    }
    document.getElementById("drawKanjiModal").style.display = 'none';
    iframeWrapperMobile.style.display = 'none';
    document.getElementById('iframe-draw-kanji').contentWindow.postMessage('http://127.0.0.1:5501/index.html', 'http://127.0.0.1:5501/iframe/drawKanji.html');
}

window.addEventListener('message', (e) => {
    const inputField = document.getElementById('tuTiengNhat');
    const currentPosition = inputField.selectionStart; // Get cursor position

    // Insert e.data at the cursor position
    inputField.value =
        inputField.value.substring(0, currentPosition) +
        e.data +
        inputField.value.substring(currentPosition);

    // Update cursor position after insertion
    inputField.selectionStart = currentPosition + e.data.length;
    inputField.selectionEnd = currentPosition + e.data.length;
});



