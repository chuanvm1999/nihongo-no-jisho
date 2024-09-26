 // Hàm để hiển thị modal
 function openDrawKanjiModal() {
    document.getElementById("drawKanjiModal").style.display = "block";
}

// Hàm để đóng modal
function closeDrawKanjiModal() {
    document.getElementById("drawKanjiModal").style.display = "none";
}

// Cho phép di chuyển modal bằng cách kéo chuột
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('drawKanjiModal');
    const modalHeader = document.querySelector('.modal-header');
    let isDragging = false;
    let offsetX, offsetY;

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