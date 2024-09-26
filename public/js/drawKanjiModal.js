 // Hàm để hiển thị modal
 function openDrawKanjiModal() {
    document.getElementById("drawKanjiModal").style.display = "block";
}

// Hàm để đóng modal
function closeDrawKanjiModal() {
    document.getElementById("drawKanjiModal").style.display = "none";
}

// ... (Mã JavaScript hiện tại của bạn)

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
    document.getElementById("drawKanjiModal").style.display = 'none';
}
document.getElementById('iframe-draw-kanji').contentWindow.postMessage('https://chuanvm1999.github.io/nihongo-no-jisho/index.html', 'https://chuanvm1999.github.io/nihongo-no-jisho/iframe/drawKanji.html');

window.addEventListener('message',(e)=>{
    document.getElementById('tuTiengNhat').value += e.data;
});