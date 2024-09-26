async function senddata() {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'https://www.drawjapanese.com/hwr/',
            data: {
                bh: lg + bihua
            },
            timeout: 9000
        });

        const uniqueChars = new Set(response);
        const kanjiinfo = document.getElementById("kanjiinfo");
        kanjiinfo.innerHTML = ''; // Xóa nội dung hiện tại của kanjiinfo

        for (const char of uniqueChars) {
            const escapedChar = char.replace(/'/g, "&#39");
            const isJapanese = (str) => !/[!#$%^&*()+=\[\]{};':"\\|,.<>\/?]/g.test(str) && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g.test(str);
            if(!isJapanese(char)){
                continue;
            }
            // Tạo phần tử button
            const button = document.createElement('button');
            button.style.width = '50px';
            button.style.height = '50px';
            button.classList.add(
                'kanjioutput',
                'bg-green-500',
                'hover:bg-green-700',
                'text-white',
                'font-bold',
                'py-2',
                'px-2',
                'rounded',
                'm-0.5'
            );
            button.type = 'button';
            button.value = escapedChar;

            // Thêm sự kiện click cho button
            button.addEventListener('click', () => {
                showmsg(escapedChar);
            });

            // Thêm text vào button
            button.textContent = escapedChar;

            // Thêm button vào kanjiinfo
            kanjiinfo.appendChild(button);
        }
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);

        // Tạo phần tử thông báo lỗi
        const errorElement = document.createElement('p');
        errorElement.textContent = "Lỗi khi nhận dạng chữ viết.";
        errorElement.classList.add('text-red-500'); // Thêm class cho màu đỏ

        // Xóa nội dung hiện tại của kanjiinfo và thêm thông báo lỗi
        kanjiinfo.innerHTML = '';
        kanjiinfo.appendChild(errorElement);
    }
}


function getCanvasCoordinates(event, isTouchDevice) {
    const rect = mycanvas.getBoundingClientRect();
    const touch = isTouchDevice ? event.touches[0] : event;
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

const mycanvas = document.getElementById("tegaki-canvas");
const ctx = mycanvas.getContext("2d");
const isTouchDevice = true;

mycanvas.addEventListener('touchstart', (e) => { onPointerDown(e, isTouchDevice) }, false);
mycanvas.addEventListener('mousedown', (e) => { onPointerDown(e, !isTouchDevice) }, false);

mycanvas.addEventListener('touchmove', (e) => { onPointerMove(e, isTouchDevice) }, false);
mycanvas.addEventListener('mousemove', (e) => { onPointerMove(e, !isTouchDevice) }, false);

mycanvas.addEventListener('touchend', onPointerUp, false);
mycanvas.addEventListener('mouseup', onPointerUp, false);
mycanvas.addEventListener('mouseout', onPointerUp, false);

let lastX, lastY;
let lg = "ja-jp";
let bihua = "";
let canvasHistory = [];

ctx.lineWidth = 6;
ctx.strokeStyle = "#000000";
let isDrawing = false;

function onPointerDown(event, isTouchDevice) {
    isDrawing = true;
    const coords = getCanvasCoordinates(event, isTouchDevice);
    lastX = coords.x;
    lastY = coords.y;

    canvasHistory.push(ctx.getImageData(0, 0, mycanvas.width, mycanvas.height));
    drawRound(lastX, lastY);
}

function onPointerUp(event) {
    isDrawing = false;
    bihua += "s";
    senddata();
}

function onPointerMove(event, isTouchDevice) {
    if (isDrawing) {
        const coords = getCanvasCoordinates(event, isTouchDevice);
        drawLine(lastX, lastY, coords.x, coords.y);
        lastX = coords.x;
        lastY = coords.y;
    }
}

function drawRound(x, y) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    bihua += `${Math.round(x)}a${Math.round(y)}a`;
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    bihua += `${Math.round(x2)}a${Math.round(y2)}a`;
}

function TEGAKI_setlang(lang) {
    lg = lang;
    senddata();
}

function showmsg(char) {
    window.addEventListener('message', (event) => {
        window.parent.postMessage(char, event.data);
    });
    rewrite();
}

function rewrite() {
    canvasHistory = []; // Xóa lịch sử canvas
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height); // Xóa nội dung canvas
    bihua = ""; // Reset chuỗi bihua
    document.getElementById("kanjiinfo").innerHTML = ""; // Xóa kết quả nhận dạng
}

function revoke() {
    if (canvasHistory.length > 0) {
        ctx.putImageData(canvasHistory.pop(), 0, 0); // Khôi phục trạng thái canvas trước đó
        // Cập nhật bihua dựa trên trạng thái canvas hiện tại
        bihua = generateBihuaFromCanvas(); // (Bạn cần tự viết hàm này)
        senddata(); // Gửi lại dữ liệu để nhận dạng
    }
}

// Hàm generateBihuaFromCanvas
function generateBihuaFromCanvas() {
    let newBihuaString = "";
    const imageData = ctx.getImageData(0, 0, mycanvas.width, mycanvas.height);
    const data = imageData.data;

    let isDrawing = false; // Biến theo dõi trạng thái vẽ
    let lastX, lastY; // Lưu trữ tọa độ điểm trước đó

    // Duyệt qua từng pixel của canvas
    for (let i = 0; i < data.length; i += 4) {
        // Kiểm tra xem pixel có màu đen (đang vẽ) hay không
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0 && data[i + 3] === 255) {
            const x = (i / 4) % mycanvas.width;
            const y = Math.floor(i / 4 / mycanvas.width);

            // Nếu là điểm bắt đầu của nét vẽ
            if (!isDrawing) {
                newBihuaString += `${Math.round(x)}a${Math.round(y)}a`;
                isDrawing = true;
            } else {
                // Nếu là điểm tiếp theo của nét vẽ
                drawLineBihua(lastX, lastY, x, y);
            }

            lastX = x;
            lastY = y;
        } else {
            // Nếu pixel không phải màu đen (không vẽ)
            if (isDrawing) {
                newBihuaString += "s"; // Thêm ký tự "s" để kết thúc nét vẽ
                isDrawing = false;
            }
        }
    }

    // Nếu nét vẽ cuối cùng chưa được kết thúc
    if (isDrawing) {
        newBihuaString += "s";
    }

    return newBihuaString;
}

// Hàm bổ sung để tạo chuỗi bihua cho đường thẳng
function drawLineBihua(x1, y1, x2, y2) {
    bihua += `${Math.round(x2)}a${Math.round(y2)}a`;
}



// Sử dụng Set để loại bỏ các ký tự trùng lặp
function TEGAKI_DeleteTheSameChar(str) {

    return html;
}


