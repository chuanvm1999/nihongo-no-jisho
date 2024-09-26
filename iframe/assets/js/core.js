const canvas = document.getElementById('handwritingCanvas');
const ctx = canvas.getContext('2d');
const drawingArea = document.getElementById('drawingArea');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

drawingArea.addEventListener('touchstart', handleTouchStart, { passive: false });
drawingArea.addEventListener('touchmove', handleTouchMove, { passive: false });
drawingArea.addEventListener('touchend', stopDrawing);

drawingArea.addEventListener('mousedown', startDrawing);
drawingArea.addEventListener('mousemove', draw);
drawingArea.addEventListener('mouseup', stopDrawing);
drawingArea.addEventListener('mouseout', stopDrawing);


function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    [lastX, lastY] = [pos.x, pos.y];
}

function draw(e) {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    [lastX, lastY] = [pos.x, pos.y];
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    draw(touch);
}

document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('recognizeBtn').addEventListener('click', () => {
    // Here you would typically send the canvas data to a backend service for recognition
    // For demonstration, we'll just set a placeholder result
    const recognitionResult = document.getElementById('recognitionResult');
    recognitionResult.innerHTML = `
                <div class="flex flex-col space-y-2 py-1">
                    <span class="bg-gray-200 rounded px-2 py-1 w-8 text-center">あ</span>
                    <span class="bg-gray-200 rounded px-2 py-1 w-8 text-center">い</span>
                    <span class="bg-gray-200 rounded px-2 py-1 w-8 text-center">う</span>
                    <span class="bg-gray-200 rounded px-2 py-1 w-8 text-center">え</span>
                    <span class="bg-gray-200 rounded px-2 py-1 w-8 text-center">お</span>
                </div>
            `;
});

// Set canvas size to match its display size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();