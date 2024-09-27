// Hàm để hiển thị modal
function openDrawKanjiModal() {
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        document.getElementById("iframe-draw-wrapper-mobile").style.display = document.getElementById("iframe-draw-wrapper-mobile").style.display == "block" ? "none" : "block";
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
// Hàm để hiển thị modal
function openImageCropModal() {
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        document.getElementById("iframe-image-wrapper-mobile").style.display = document.getElementById("iframe-image-wrapper-mobile").style.display == "block" ? "none" : "block";
    } else {
        document.getElementById("imageCropModal").style.display = "block";
    }
}

// Hàm để đóng modal
function closeImageCropModal() {
    if (window.innerWidth <= 768) { // Adjust breakpoint as needed
        document.getElementById("iframe-image-wrapper-mobile").style.display = "none";
    } else {
        document.getElementById("imageCropModal").style.display = "none";
    }
}

// Cho phép di chuyển modal bằng cách kéo chuột
document.addEventListener('DOMContentLoaded',
    function () {
        makeElementDraggable('drawKanjiModal', '.modal-header');
        makeElementDraggable('imageCropModal', '.modal-header');
    }
);

function makeElementDraggable(elementId, handleId) {
    const element = document.getElementById(elementId);
    const handle = element.querySelector(handleId);
    let isDragging = false;
    let offsetX, offsetY;

    // Sự kiện bắt đầu chạm cho thiết bị cảm ứng
    handle.addEventListener('touchstart', function (e) {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - element.offsetLeft;
        offsetY = touch.clientY - element.offsetTop;
    });

    // Sự kiện di chuyển chạm
    document.addEventListener('touchmove', function (e) {
        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            element.style.left = (touch.clientX - offsetX) + 'px';
            element.style.top = (touch.clientY - offsetY) + 'px';
        }
    });

    // Sự kiện kết thúc chạm
    document.addEventListener('touchend', function () {
        isDragging = false;
    });

    // Sự kiện bắt đầu kéo chuột
    handle.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });

    // Sự kiện di chuyển chuột
    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    // Sự kiện kết thúc kéo chuột
    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
}

window.onload = function () {
    const iframeWrapperMobile = document.getElementById('iframe-draw-wrapper-mobile');
    const iframeWrapperWeb = document.querySelector('.modal-content');

    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.src = 'https://chuanvm1999.github.io/nihongo-no-jisho/iframe/drawKanji.html';
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
    document.getElementById('iframe-draw-kanji').contentWindow.postMessage('https://chuanvm1999.github.io/nihongo-no-jisho/index.html', 'https://chuanvm1999.github.io/nihongo-no-jisho/iframe/drawKanji.html');
}

window.addEventListener('message', (e) => {
    const inputField = document.getElementById('tuTiengNhat');
    if (e.data.recognizedText) {
        const recognizedText = e.data.recognizedText;
        inputField.value = recognizedText;
        closeImageCropModal();
    }
    else {
        const currentPosition = inputField.selectionStart; // Get cursor position

        // Insert e.data at the cursor position
        inputField.value =
            inputField.value.substring(0, currentPosition) +
            e.data +
            inputField.value.substring(currentPosition);

        // Update cursor position after insertion
        inputField.selectionStart = currentPosition + e.data.length;
        inputField.selectionEnd = currentPosition + e.data.length;
    }
});



