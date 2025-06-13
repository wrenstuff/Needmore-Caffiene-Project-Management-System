let isDrawing = false; // Tracks if drawing input is active //
let canvas = document.getElementById('canvas');
let ctx;

function activateDrawing() { // Activates drawing ability //
  let drawCanvas = document.getElementById('drawCanvas');
  if (!drawCanvas) {
    drawCanvas = document.createElement('canvas');
    drawCanvas.id = 'drawCanvas';
    drawCanvas.width = canvas.offsetWidth; 
    drawCanvas.height = canvas.offsetHeight;
    drawCanvas.style.position = 'absolute';
    drawCanvas.style.top = 0; 
    drawCanvas.style.left = 0;
    drawCanvas.style.zIndex = 999;
    canvas.appendChild(drawCanvas);
  }

  ctx = drawCanvas.getContext('2d'); // Allows drawing on canvas //
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  drawCanvas.addEventListener('mousedown', startDraw); // Function to start mouse drawing //
  drawCanvas.addEventListener('mousemove', draw); // Function to continue mouse drawing //
  drawCanvas.addEventListener('mouseup', stopDraw); // Function to stop mouse drawing //
  drawCanvas.addEventListener('mouseleave', stopDraw); // Function to stop mouse drawing //
}

function deactivateDrawing() { // Deactivates drawing ability //
  const drawCanvas = document.getElementById('drawCanvas');
  if (drawCanvas) {
    drawCanvas.removeEventListener('mousedown', startDraw);
    drawCanvas.removeEventListener('mousemove', draw);
    drawCanvas.removeEventListener('mouseup', stopDraw);
    drawCanvas.removeEventListener('mouseleave', stopDraw);
  }
  isDrawing = false;
}

function startDraw(e) { // Starts drawing on mouse down click //
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) { // Continues drawing on mouse move //
  if (!isDrawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDraw() { // Stops drawing when mouse click is released or leaves the area //
  isDrawing = false;
  ctx.closePath();
}
