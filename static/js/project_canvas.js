document.addEventListener('DOMContentLoaded', () => {
  // --- Movable Toolbar Setup ---
  const toolbar = document.getElementById('toolbar');
  const toolbarHeader = document.getElementById('toolbar-header');

  let isDraggingToolbar = false;
  let dragOffset = { x: 0, y: 0 };

  toolbarHeader.addEventListener('mousedown', (e) => {
    isDraggingToolbar = true;
    dragOffset.x = e.clientX - toolbar.offsetLeft;
    dragOffset.y = e.clientY - toolbar.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDraggingToolbar) {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Keep toolbar inside viewport
      newX = Math.max(0, Math.min(window.innerWidth - toolbar.offsetWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - toolbar.offsetHeight, newY));

      toolbar.style.left = newX + 'px';
      toolbar.style.top = newY + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDraggingToolbar = false;
  });

  // --- Canvas Drawing App Setup ---
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const statusText = document.getElementById('status');

  const penButton = document.getElementById('pen-tool');
  const stickyButton = document.getElementById('sticky-note');

  if (!penButton || !stickyButton) {
    console.error('Missing toolbar buttons: pen-tool or sticky-note');
    return;
  }

  let boxes = [];
  let stickyNotes = [];
  let penPaths = [];
  let selectedBoxes = new Set();
  let selectedStickyNotes = new Set();
  let selectedPens = new Set();

  let isDrawingBox = false;
  let isDrawingPen = false;
  let isDrawingSticky = false;
  let isSelecting = false;
  let isDragging = false;
  let isResizing = false;

  let currentBox = null;
  let currentPenPath = [];
  let selectRect = null;

  let dragStart = { x: 0, y: 0 };
  let dragStartPos = null;
  let resizeHandle = null;
  let combinedBounds = null;

  // Original object data at drag/resize start
  let originalObjects = {
    boxes: [],
    stickyNotes: [],
    penPaths: [],
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pen paths
    penPaths.forEach((path, i) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = selectedPens.has(i) ? 'red' : 'black';
      path.forEach((pt, j) => (j === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      if (selectedPens.has(i)) {
        // Draw bounding box for pen path
        const bounds = getBounds(path);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        drawResizeAnchors(bounds);
      }
    });

    // Draw boxes
    boxes.forEach((box, i) => {
      ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
      ctx.fillRect(box.x, box.y, box.width, box.height);
      if (selectedBoxes.has(i)) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        drawResizeAnchors(box);
      }
    });

    // Draw current box during drawing
    if (isDrawingBox && currentBox) {
      const norm = normalizeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      ctx.strokeStyle = 'green';
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(norm.x, norm.y, norm.width, norm.height);
      ctx.setLineDash([]);
    }

    // Draw sticky notes
    stickyNotes.forEach((note, i) => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(note.x, note.y, 150, 100);
      ctx.strokeStyle = selectedStickyNotes.has(i) ? 'red' : 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(note.x, note.y, 150, 100);
      ctx.fillStyle = 'black';
      ctx.font = '14px sans-serif';
      wrapText(ctx, note.text, note.x + 5, note.y + 20, 140, 16);
      if (selectedStickyNotes.has(i)) {
        drawResizeAnchors({ x: note.x, y: note.y, width: 150, height: 100 });
      }
    });

    // Draw selection rect
    if (isSelecting && selectRect) {
      const norm = normalizeRect(selectRect.x, selectRect.y, selectRect.width, selectRect.height);
      ctx.strokeStyle = 'green';
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(norm.x, norm.y, norm.width, norm.height);
      ctx.setLineDash([]);
    }

    // Draw combined bounds of all selected objects
    const combined = getCombinedBounds();
    if (combined && (selectedBoxes.size + selectedStickyNotes.size + selectedPens.size) > 1) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(combined.x, combined.y, combined.width, combined.height);
      ctx.setLineDash([]);
      drawResizeAnchors(combined);
    }

    updateStatus();
  }

  function drawResizeAnchors(rect) {
    const size = 10;
    const half = size / 2;
    const anchors = [
      { x: rect.x, y: rect.y, cursor: 'nwse-resize', name: 'top-left' },
      { x: rect.x + rect.width / 2, y: rect.y, cursor: 'ns-resize', name: 'top' },
      { x: rect.x + rect.width, y: rect.y, cursor: 'nesw-resize', name: 'top-right' },
      { x: rect.x + rect.width, y: rect.y + rect.height / 2, cursor: 'ew-resize', name: 'right' },
      { x: rect.x + rect.width, y: rect.y + rect.height, cursor: 'nwse-resize', name: 'bottom-right' },
      { x: rect.x + rect.width / 2, y: rect.y + rect.height, cursor: 'ns-resize', name: 'bottom' },
      { x: rect.x, y: rect.y + rect.height, cursor: 'nesw-resize', name: 'bottom-left' },
      { x: rect.x, y: rect.y + rect.height / 2, cursor: 'ew-resize', name: 'left' },
    ];
    anchors.forEach((a) => {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(a.x - half, a.y - half, size, size);
      ctx.fill();
      ctx.stroke();
    });
  }

  function updateStatus() {
    const count =
      selectedBoxes.size + selectedStickyNotes.size + selectedPens.size;
    statusText.textContent = count === 0 ? 'No selection' : `${count} selected`;
  }

  // Helper: wrap text inside sticky note
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  function normalizeRect(x, y, w, h) {
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    return { x, y, width: w, height: h };
  }

  function getBounds(path) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    path.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    });
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  function pointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  }

  function getResizeHandle(x, y, rect) {
    const size = 10;
    const half = size / 2;
    const anchors = {
      'top-left': { x: rect.x, y: rect.y },
      'top': { x: rect.x + rect.width / 2, y: rect.y },
      'top-right': { x: rect.x + rect.width, y: rect.y },
      'right': { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
      'bottom-right': { x: rect.x + rect.width, y: rect.y + rect.height },
      'bottom': { x: rect.x + rect.width / 2, y: rect.y + rect.height },
      'bottom-left': { x: rect.x, y: rect.y + rect.height },
      'left': { x: rect.x, y: rect.y + rect.height / 2 },
    };

    for (const name in anchors) {
      const a = anchors[name];
      if (Math.abs(x - a.x) <= half && Math.abs(y - a.y) <= half) {
        return name;
      }
    }
    return null;
  }

  function getCombinedBounds() {
    let allRects = [];

    selectedBoxes.forEach(i => allRects.push(boxes[i]));
    selectedStickyNotes.forEach(i => allRects.push({ x: stickyNotes[i].x, y: stickyNotes[i].y, width: 150, height: 100 }));
    selectedPens.forEach(i => allRects.push(getBounds(penPaths[i])));

    if (allRects.length === 0) return null;

    let minX = Math.min(...allRects.map(r => r.x));
    let minY = Math.min(...allRects.map(r => r.y));
    let maxX = Math.max(...allRects.map(r => r.x + r.width));
    let maxY = Math.max(...allRects.map(r => r.y + r.height));

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  function scaleRect(orig, bounds, scaleX, scaleY, handle) {
    let newX = orig.x;
    let newY = orig.y;
    let newW = orig.width;
    let newH = orig.height;

    const right = orig.x + orig.width;
    const bottom = orig.y + orig.height;

    switch (handle) {
      case 'top-left':
        newX = bounds.x + (orig.x - bounds.x) * scaleX;
        newY = bounds.y + (orig.y - bounds.y) * scaleY;
        newW = (right - newX) * scaleX;
        newH = (bottom - newY) * scaleY;
        break;
      case 'top':
        newY = bounds.y + (orig.y - bounds.y) * scaleY;
        newH = (bottom - newY) * scaleY;
        break;
      case 'top-right':
        newY = bounds.y + (orig.y - bounds.y) * scaleY;
        newW = (right - orig.x) * scaleX;
        newH = (bottom - newY) * scaleY;
        break;
      case 'right':
        newW = (right - orig.x) * scaleX;
        break;
      case 'bottom-right':
        newW = (right - orig.x) * scaleX;
        newH = (bottom - orig.y) * scaleY;
        break;
      case 'bottom':
        newH = (bottom - orig.y) * scaleY;
        break;
      case 'bottom-left':
        newX = bounds.x + (orig.x - bounds.x) * scaleX;
        newW = (right - newX) * scaleX;
        newH = (bottom - orig.y) * scaleY;
        break;
      case 'left':
        newX = bounds.x + (orig.x - bounds.x) * scaleX;
        newW = (right - newX) * scaleX;
        break;
    }

    if (newW < 10) newW = 10;
    if (newH < 10) newH = 10;

    return { x: newX, y: newY, width: newW, height: newH };
  }

  function scalePoint(value, boundStart, boundSize, scale, handle, axis) {
    let posRel = (value - boundStart) / boundSize;
    let newPosRel = posRel * scale;

    if (
      (axis === 'x' && (handle === 'left' || handle === 'top-left' || handle === 'bottom-left')) ||
      (axis === 'y' && (handle === 'top' || handle === 'top-left' || handle === 'top-right'))
    ) {
      newPosRel = 1 - newPosRel;
      return boundStart + boundSize * (1 - newPosRel);
    }
    return boundStart + boundSize * newPosRel;
  }

  function resetTools() {
    isDrawingBox = false;
    isDrawingPen = false;
    isDrawingSticky = false;
  }

  // Button handlers
  document.getElementById('draw-box').addEventListener('click', () => {
    resetTools();
    isDrawingBox = true;
  });

  penButton.addEventListener('click', () => {
    resetTools();
    isDrawingPen = true;
  });

  stickyButton.addEventListener('click', () => {
    resetTools();
    isDrawingSticky = true;
  });

  document.getElementById('delete-box').addEventListener('click', () => {
    boxes = boxes.filter((_, i) => !selectedBoxes.has(i));
    stickyNotes = stickyNotes.filter((_, i) => !selectedStickyNotes.has(i));
    penPaths = penPaths.filter((_, i) => !selectedPens.has(i));
    selectedBoxes.clear();
    selectedStickyNotes.clear();
    selectedPens.clear();
    draw();
  });

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragStart = { x, y };

    if (isDrawingPen) {
      currentPenPath = [{ x, y }];
      return;
    }

    if (isDrawingSticky) {
      const text = prompt('Sticky note text:');
      if (text) stickyNotes.push({ x, y, text });
      resetTools();
      draw();
      return;
    }

    if (isDrawingBox) {
      currentBox = { x, y, width: 0, height: 0 };
      return;
    }

    combinedBounds = getCombinedBounds();
    if (combinedBounds) {
      const handle = getResizeHandle(x, y, combinedBounds);
      if (handle) {
        isResizing = true;
        resizeHandle = handle;
        originalObjects.boxes = [...selectedBoxes].map(i => ({ ...boxes[i] }));
        originalObjects.stickyNotes = [...selectedStickyNotes].map(i => ({ ...stickyNotes[i] }));
        originalObjects.penPaths = [...selectedPens].map(i => penPaths[i].map(p => ({ ...p })));
        dragStartPos = { x, y };
        return;
      }
    }

    if (combinedBounds && pointInRect(x, y, combinedBounds)) {
      isDragging = true;
      dragStartPos = { x, y };
      originalObjects.boxes = [...selectedBoxes].map(i => ({ ...boxes[i] }));
      originalObjects.stickyNotes = [...selectedStickyNotes].map(i => ({ ...stickyNotes[i] }));
      originalObjects.penPaths = [...selectedPens].map(i => penPaths[i].map(p => ({ ...p })));
      return;
    }

    selectedBoxes.clear();
    selectedStickyNotes.clear();
    selectedPens.clear();

    isSelecting = true;
    selectRect = { x, y, width: 0, height: 0 };
    draw();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawingPen && e.buttons === 1) {
      currentPenPath.push({ x, y });
      draw();
      return;
    }

    if (isDrawingBox && currentBox) {
      currentBox.width = x - currentBox.x;
      currentBox.height = y - currentBox.y;
      draw();
      return;
    }

    if (isSelecting && selectRect) {
      selectRect.width = x - dragStart.x;
      selectRect.height = y - dragStart.y;
      draw();
      return;
    }

    if (isResizing && combinedBounds) {
      const scaleX = getScale(x, resizeHandle, combinedBounds.x, combinedBounds.width, 'x');
      const scaleY = getScale(y, resizeHandle, combinedBounds.y, combinedBounds.height, 'y');

      [...selectedBoxes].forEach((idx, i) => {
        boxes[idx] = scaleRect(originalObjects.boxes[i], combinedBounds, scaleX, scaleY, resizeHandle);
      });

      [...selectedStickyNotes].forEach((idx, i) => {
        const orig = originalObjects.stickyNotes[i];
        const newRect = scaleRect(
          { x: orig.x, y: orig.y, width: 150, height: 100 },
          combinedBounds, scaleX, scaleY, resizeHandle
        );
        stickyNotes[idx].x = newRect.x;
        stickyNotes[idx].y = newRect.y;
      });

      [...selectedPens].forEach((idx, i) => {
        const originalPath = originalObjects.penPaths[i];
        penPaths[idx] = originalPath.map(pt => {
          return {
            x: scalePoint(pt.x, combinedBounds.x, combinedBounds.width, scaleX, resizeHandle, 'x'),
            y: scalePoint(pt.y, combinedBounds.y, combinedBounds.height, scaleY, resizeHandle, 'y'),
          };
        });
      });

      draw();
      return;
    }

    if (isDragging && dragStartPos) {
      const dx = x - dragStartPos.x;
      const dy = y - dragStartPos.y;

      [...selectedBoxes].forEach((idx, i) => {
        boxes[idx].x = originalObjects.boxes[i].x + dx;
        boxes[idx].y = originalObjects.boxes[i].y + dy;
      });

      [...selectedStickyNotes].forEach((idx, i) => {
        stickyNotes[idx].x = originalObjects.stickyNotes[i].x + dx;
        stickyNotes[idx].y = originalObjects.stickyNotes[i].y + dy;
      });

      [...selectedPens].forEach((idx, i) => {
        penPaths[idx] = originalObjects.penPaths[i].map(pt => ({
          x: pt.x + dx,
          y: pt.y + dy,
        }));
      });

      draw();
      return;
    }

    // Update cursor based on hover over resize handles or combined box
    const combined = getCombinedBounds();
    if (combined) {
      const handle = getResizeHandle(x, y, combined);
      if (handle) {
        canvas.style.cursor = getCursorForHandle(handle);
        return;
      }
      if (pointInRect(x, y, combined)) {
        canvas.style.cursor = 'move';
        return;
      }
    }
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('mouseup', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawingPen && currentPenPath.length) {
      penPaths.push(currentPenPath);
      currentPenPath = [];
      isDrawingPen = false;
      draw();
      return;
    }

    if (isDrawingBox && currentBox) {
      const norm = normalizeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      if (norm.width > 5 && norm.height > 5) boxes.push(norm);
      currentBox = null;
      isDrawingBox = false;
      draw();
      return;
    }

    if (isSelecting && selectRect) {
      const norm = normalizeRect(selectRect.x, selectRect.y, selectRect.width, selectRect.height);
      selectedBoxes.clear();
      selectedStickyNotes.clear();
      selectedPens.clear();

      boxes.forEach((box, i) => {
        if (rectsOverlap(box, norm)) selectedBoxes.add(i);
      });
      stickyNotes.forEach((note, i) => {
        if (rectsOverlap({ x: note.x, y: note.y, width: 150, height: 100 }, norm))
          selectedStickyNotes.add(i);
      });
      penPaths.forEach((path, i) => {
        const bounds = getBounds(path);
        if (rectsOverlap(bounds, norm)) selectedPens.add(i);
      });

      isSelecting = false;
      selectRect = null;
      draw();
      return;
    }

    if (isDragging) {
      isDragging = false;
      return;
    }

    if (isResizing) {
      isResizing = false;
      resizeHandle = null;
      return;
    }
  });

  function rectsOverlap(a, b) {
    return !(b.x > a.x + a.width || 
             b.x + b.width < a.x || 
             b.y > a.y + a.height ||
             b.y + b.height < a.y);
  }

  function getScale(pos, handle, boundStart, boundSize, axis) {
    let scale = 1;
    switch (handle) {
      case 'top-left':
      case 'left':
      case 'bottom-left':
        scale = (boundStart + boundSize - pos) / boundSize;
        break;
      case 'top':
      case 'bottom':
        if (axis === 'y') {
          if (handle === 'top') scale = (boundStart + boundSize - pos) / boundSize;
          else scale = (pos - boundStart) / boundSize;
        }
        break;
      case 'top-right':
      case 'right':
      case 'bottom-right':
        scale = (pos - boundStart) / boundSize;
        break;
    }
    return scale > 0.05 ? scale : 0.05;
  }

  function getCursorForHandle(handle) {
    const cursors = {
      'top-left': 'nwse-resize',
      'top': 'ns-resize',
      'top-right': 'nesw-resize',
      'right': 'ew-resize',
      'bottom-right': 'nwse-resize',
      'bottom': 'ns-resize',
      'bottom-left': 'nesw-resize',
      'left': 'ew-resize',
    };
    return cursors[handle] || 'default';
  }

  draw();
});
