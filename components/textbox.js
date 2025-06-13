export function addTextBox() { // Function to add a draggable text box to the sandbox area //
  const sandbox = document.getElementById('sandboxArea');
  const box = document.createElement('div');
  box.className = 'draggable';
  box.contentEditable = true;

  box.innerHTML = '<span class="placeholder">Enter text...</span>'; // Placeholder text for the text box //

  box.addEventListener('focus', () => {  // Removes placeholder when the text box is clicked to edit //
    const placeholder = box.querySelector('.placeholder');
    if (placeholder) placeholder.remove();
  });

  box.addEventListener('blur', () => { // Adds placeholder back if the text box is empty when focus is lost //
    if (box.innerText.trim() === '') {
      box.innerHTML = '<span class="placeholder">Enter text...</span>';
    }
  });

  Object.assign(box.style, { // Styles for the text box //
    position: 'absolute',
    left: '100px',
    top: '100px',
    width: '220px',
    height: '150px',
    backgroundColor: '#ffffff',
    border: '1px solid #888',
    borderRadius: '4px',
    color: 'white',
    padding: '6px',
    zIndex: 1100,
  });

  sandbox.appendChild(box); 
  makeDraggable(box);
}

function makeDraggable(el) { // Function to make the text box draggable within the sandbox area //
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener('mousedown', (e) => { // Mouse down click to initiate dragging //
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.zIndex = 1200;
  });

  document.addEventListener('mousemove', (e) => { // Mouse move that updates the position of the text box while dragging //
    if (!isDragging) return;

    const sandbox = document.getElementById('sandboxArea'); 
    const sbRect = sandbox.getBoundingClientRect();
    const gridSize = 20;

    let newLeft = Math.round((e.clientX - sbRect.left - offsetX) / gridSize) * gridSize; 
    let newTop = Math.round((e.clientY - sbRect.top - offsetY) / gridSize) * gridSize;

    const boxBottom = newTop + el.offsetHeight; // Calculation for the bottom of the textbox to ensure its within the sandbox constraints //
    if (boxBottom > sandbox.offsetHeight && sandbox.offsetHeight < 2040) {
      sandbox.style.height = `${Math.min(boxBottom + 20, 2040)}px`;
    }

    newLeft = Math.max(0, Math.min(newLeft, sandbox.clientWidth - el.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, sandbox.offsetHeight - el.offsetHeight));

    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => { // Stops dragging when the mouse click is released //
    if (isDragging) {
      isDragging = false;
      el.style.zIndex = '';
    }
  });
}
