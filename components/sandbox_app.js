// -- GLOBAL VARIABLES -- //
let currentTool = null;
let activeTextBox = null;
let isDrawingLine = false;
let lineStart = null;

document.addEventListener('DOMContentLoaded', () => {
  initializeToolbar();
  initializeSandbox();
  
  // This forces the canvas to resize after the DOM (Document Object Model) is ready //
  setTimeout(() => {
    const canvas = document.getElementById('drawingCanvas');
    const sandbox = document.getElementById('sandboxArea');
    
    if (canvas && sandbox) {
      const sandboxRect = sandbox.getBoundingClientRect();
      console.log('Forcing canvas resize to:', sandboxRect.width, 'x', sandboxRect.height);
      
      canvas.width = sandboxRect.width;
      canvas.height = sandboxRect.height;
      canvas.style.width = sandboxRect.width + 'px';
      canvas.style.height = sandboxRect.height + 'px';
    }
  }, 100);
});

// -- TOOLBAR FUNCTIONS -- //
function initializeToolbar() {
  document.querySelectorAll('.icon[data-tool]').forEach(icon => {
    icon.addEventListener('click', () => {
      document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      setTool(icon.dataset.tool);
    });
  });
}

// Toggles toolbar when the collapse button is clicked //
function toggleToolbar(toolbarId) {
  const toolbar = document.getElementById(toolbarId);
  const btn = toolbar.querySelector('.collapse-btn');
  
  toolbar.classList.toggle('collapsed');
  btn.classList.toggle('collapsed');
}

// -- SANDBOX -- //
function initializeSandbox() {
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  const sandbox = document.getElementById('sandboxArea');

  // This retrieves the dimensions of the sandbox //
  const sandboxRect = sandbox.getBoundingClientRect();
  const width = sandboxRect.width;
  const height = sandboxRect.height;
  
  // This sets the canvas to match the sandbox size //
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Sets the initial canvas style //
  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // This adds a resize observer to handle canvas expansion //
  const resizeObserver = new ResizeObserver(() => {
    const newRect = sandbox.getBoundingClientRect();
    canvas.width = newRect.width;
    canvas.height = newRect.height;
    canvas.style.width = newRect.width + 'px';
    canvas.style.height = newRect.height + 'px';
    
    // Ensures all draggable elements stay within the new canvas //
    constrainAllElementsToCanvas();
  });
  resizeObserver.observe(sandbox);
}

// -- TOOL MANAGEMENT -- //
function setTool(name) {
  currentTool = name;
  clearCanvasHandlers();
  console.log(`🎯 Tool selected: ${name}`);
  // Switch case for tool selection //
  switch (name) {
    case 'addTextBox': 
      createTextBox();
      break;
    case 'projectCard':
      createProjectCard();
      break;
    case 'draw':
      activateDrawMode();
      break;
    case 'erase':
      activateEraser();
      break;
    case 'line':
      enableLineDrawing();
      break;
    case 'shape':
      showFeatureComingSoon('Shape Tool');
      break;
    case 'uploadImage':
      showFeatureComingSoon('Upload Image');
      break;
    case 'heading':
      showFeatureComingSoon('Heading Tool');
      break;
    case 'barGraph':
      showFeatureComingSoon('Bar Graph Tool');
      break;
    case 'pieChart':
      showFeatureComingSoon('Pie Chart Tool');
      break;
    case 'table':
      showFeatureComingSoon('Table Organizer');
      break;
    case 'layers':
      showFeatureComingSoon('Layers Tool');
      break;
    case 'settings':
      showFeatureComingSoon('Settings Tool');
      break;
    case 'colorPicker':
      activateColorPicker();
      break;
    case 'fontSize':
      activateFontSizeTool();
      break;
    default:
      console.warn('Unknown tool:', name);
  }
}

// Handles clearing the canvas when a tool is selected //
function clearCanvasHandlers() {
  const canvas = document.getElementById('drawingCanvas');
  if (!canvas) return;

  canvas.onclick = canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = null;
  canvas.classList.remove('pen-cursor', 'canvas-crosshair', 'canvas-cell');
  canvas.classList.add('canvas-default');

  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'source-over';
}

// -- DRAW TOOL -- //
function activateDrawMode() {
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  let drawing = false;

  canvas.classList.remove('canvas-default', 'canvas-cell');
  canvas.classList.add('canvas-crosshair', 'pen-cursor');

  canvas.onmousedown = (e) => { // Mouse click to draw //
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  canvas.onmousemove = (e) => { // Mouse movement to draw //
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  canvas.onmouseup = () => { // Mouse click release to stop drawing //
    drawing = false;
  };
}

// -- ERASE TOOL -- //
function activateEraser() {
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  let erasing = false;

  canvas.classList.remove('canvas-default', 'canvas-crosshair', 'pen-cursor');
  canvas.classList.add('canvas-cell');

  canvas.onmousedown = (e) => { // Mouse click to erase //
    erasing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  canvas.onmousemove = (e) => {
    if (!erasing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 20;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  canvas.onmouseup = () => { // Mouse click release to stop erasing //
    erasing = false;
    ctx.globalCompositeOperation = 'source-over';
  };
}

// -- LINE TOOL -- //
function enableLineDrawing() {  
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');

  isDrawingLine = false;
  lineStart = null;
  canvas.classList.remove('canvas-default', 'canvas-cell', 'pen-cursor');
  canvas.classList.add('canvas-crosshair');

  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isDrawingLine) {
      lineStart = { x, y };
      isDrawingLine = true;
    } else {
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      isDrawingLine = false;
      lineStart = null;
    }
  };
}

// -- TEXTBOX TOOL -- //
function createTextBox(x = 100, y = 100) {
  console.log('📝 Creating text box at:', x, y);
  const sandbox = document.getElementById('sandboxArea');
  
  // This retrieves the dimensions of the sandbox //
  const sandboxRect = sandbox.getBoundingClientRect();
  const textBoxWidth = 320;
  const textBoxHeight = 180;
  
  // Calculates the center position so it stays within bounds //
  let centerX = (sandboxRect.width - textBoxWidth) / 2;
  let topY = 10; 
  
  // Ensures the text box doesn't go outside the canvas //
  centerX = Math.max(0, Math.min(centerX, sandboxRect.width - textBoxWidth));
  topY = Math.max(0, Math.min(topY, sandboxRect.height - textBoxHeight));
  
  // Creates the container for the text box //
  const container = document.createElement('div');
  container.className = 'text-box-container position-absolute';
  container.style.left = `${centerX}px`;
  container.style.top = `${topY}px`;
  
  // Creates the editable box //
  const editableBox = document.createElement('div');
  editableBox.className = 'editable-box';
  editableBox.contentEditable = true;
  editableBox.spellcheck = false;
  editableBox.setAttribute('data-gramm', 'false');
  editableBox.setAttribute('data-gramm_editor', 'false');

  const placeholder = document.createElement('span');
  placeholder.className = 'placeholder';
  placeholder.textContent = 'Enter text here...';
  editableBox.appendChild(placeholder);

  function updatePlaceholder() {
    const hasText = editableBox.textContent.trim().length > 0;
    placeholder.style.display = hasText ? 'none' : 'block';
  }

  editableBox.addEventListener('input', updatePlaceholder);
  editableBox.addEventListener('focus', updatePlaceholder);
  editableBox.addEventListener('blur', updatePlaceholder);
  editableBox.addEventListener('keydown', updatePlaceholder);
  editableBox.addEventListener('paste', updatePlaceholder);

  // Delete button //
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => container.remove());

  // Hamburger button for formatting //
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'hamburger-btn';
  hamburgerBtn.textContent = 'A̲';

  // -- FORMAT TOOLBAR -- //
  const toolbar = document.createElement('div');
  toolbar.className = 'textbox-toolbar';
  
  // Font size options //
  const fontSizeSelect = document.createElement('select');
  [12, 14, 16, 18, 20, 24, 32, 48].forEach(size => {
    const opt = document.createElement('option');
    opt.value = size;
    opt.textContent = size;
    if (size === 16) opt.selected = true;
    fontSizeSelect.appendChild(opt);
  });
  fontSizeSelect.addEventListener('change', () => {
    document.execCommand('fontSize', false, fontSizeSelect.value);
    editableBox.focus();
  });
  
  // Bold button //
  const boldBtn = document.createElement('button');
  boldBtn.textContent = 'B';
  boldBtn.className = 'bold-btn';
  boldBtn.addEventListener('click', () => {
    document.execCommand('bold');
    editableBox.focus();
  });
  
  // Italic button //
  const italicBtn = document.createElement('button');
  italicBtn.textContent = 'I';
  italicBtn.className = 'italic-btn';
  italicBtn.addEventListener('click', () => {
    document.execCommand('italic');
    editableBox.focus();
  });
  
  // Underline button //
  const underlineBtn = document.createElement('button');
  underlineBtn.textContent = 'U';
  underlineBtn.className = 'underline-btn';
  underlineBtn.addEventListener('click', () => {
    document.execCommand('underline');
    editableBox.focus();
  });
  
  // Colour button //
  const colorBtn = document.createElement('button');
  colorBtn.textContent = '🎨';
  colorBtn.addEventListener('click', () => {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#000000';
    colorPicker.addEventListener('change', (e) => {
      document.execCommand('foreColor', false, e.target.value);
      editableBox.focus();
    });
    colorPicker.click();
  });
  
  // Highlight button //
  const highlightBtn = document.createElement('button');
  highlightBtn.textContent = '🖍️';
  highlightBtn.addEventListener('click', () => {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = '#ffff00';
    colorPicker.addEventListener('change', (e) => {
      document.execCommand('hiliteColor', false, e.target.value);
      editableBox.focus();
    });
    colorPicker.click();
  });
  
  // Appends the toolbar to the container //
  toolbar.append(fontSizeSelect, boldBtn, italicBtn, underlineBtn, colorBtn, highlightBtn);
  hamburgerBtn.addEventListener('click', () => {
    toolbar.classList.toggle('open');
  });
  
  // Appends everything to the container //
  container.append(editableBox, deleteBtn, hamburgerBtn, toolbar);
  sandbox.appendChild(container);
  updatePlaceholder();

  // -- DRAG FUNCTIONALITY -- //
  console.log('🔧 About to make draggable:', container);
  makeDraggable(container);
  console.log('✅ Text box created and made draggable');

  return container;
}

// -- PROJECT CARD TOOL -- //
function createProjectCard(x = 100, y = 100) {
  const sandbox = document.getElementById('sandboxArea');
  // This retrieves the dimensions of the sandbox //
  const sandboxRect = sandbox.getBoundingClientRect();
  const cardWidth = 280;
  const cardHeight = 220;
  
  // Calculates the center position to stay within limits //
  let centerX = (sandboxRect.width - cardWidth) / 2;
  let topY = 10; 
  
  // Ensures the card doesn't go outside the canvas //
  centerX = Math.max(0, Math.min(centerX, sandboxRect.width - cardWidth));
  topY = Math.max(0, Math.min(topY, sandboxRect.height - cardHeight));
  
  // Creates card container //
  const card = document.createElement('div');
  card.className = 'project-card position-absolute';
  card.style.left = `${centerX}px`;
  card.style.top = `${topY}px`;
  
  // Creates card header //
  const header = document.createElement('div');
  header.className = 'card-header';
  
  // Creates card title //
  const title = document.createElement('input');
  title.className = 'card-title';
  title.type = 'text';
  title.placeholder = 'Project Title';
  
  // Creates delete button //
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'card-delete';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => card.remove());
  
  // Appends title and delete button to header //
  header.append(title, deleteBtn);
  
  // Creates card description //
  const description = document.createElement('textarea');
  description.className = 'card-description';
  description.placeholder = 'Project description...';
  
  // Creates card footer //
  const footer = document.createElement('div');
  footer.className = 'card-footer';
  
  // Appends everything to the card //
  footer.append();
  card.append(header, description, footer);
  sandbox.appendChild(card);

  makeDraggable(card, 1);
  return card;
}

// -- DRAGGING FUNCTIONALITY -- //
function makeDraggable(element, speed = 1) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  
  // Add draggable cursor class to element //
  element.classList.add('draggable-element');
  
  element.addEventListener('mousedown', function(e) {
    // Prevents dragging if clicking on resize handles, buttons, or editable content //
    if (e.target.closest('button, select, .textbox-toolbar, .delete-btn, .hamburger-btn') || 
        e.target.contentEditable === 'true' ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.style.cursor === 'nw-resize' ||
        e.target.style.cursor === 'ne-resize' ||
        e.target.style.cursor === 'sw-resize' ||
        e.target.style.cursor === 'se-resize' ||
        e.target.style.cursor === 'n-resize' ||
        e.target.style.cursor === 's-resize' ||
        e.target.style.cursor === 'e-resize' ||
        e.target.style.cursor === 'w-resize') {
      return;
    }
    
    // Checks if we're near the resize area (bottom-right corner of textbox) //
    const rect = element.getBoundingClientRect();
    const isNearResizeHandle = (
      e.clientX > rect.right - 20 && 
      e.clientY > rect.bottom - 20
    );
    
    if (isNearResizeHandle) {
      return; // Prevents any dragging if near resize handle //
    }
    
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(element.style.left) || 0;
    startTop = parseInt(element.style.top) || 0;
    element.classList.add('grabbing');
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = (e.clientX - startX) * speed;
    const deltaY = (e.clientY - startY) * speed;
    let newLeft = startLeft + deltaX;
    let newTop = startTop + deltaY;
    
    // This retrieves the canvas boundaries //
    const sandbox = document.getElementById('sandboxArea');
    const sandboxRect = sandbox.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Calculates the boundaries to keep element within canvas limits //
    const minLeft = 0;
    const maxLeft = sandboxRect.width - elementRect.width;
    const minTop = 0;
    const maxTop = sandboxRect.height - elementRect.height;
    
    // Constrains position within boundaries //
    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    newTop = Math.max(minTop, Math.min(maxTop, newTop));
    
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
  });
  
  document.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    isDragging = false;
    element.classList.remove('grabbing');
  });
}

// -- COLOUR PICKER TOOL -- //
function activateColorPicker() {
  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = '#000000';
  
  colorPicker.addEventListener('change', (e) => {
    const selectedColor = e.target.value;
    console.log('Colour selected:', selectedColor);
    
    // Stores the selected colour for use with drawing tools //
    window.selectedColor = selectedColor;
    
    // Updates the draw tool to use the new colour //
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = selectedColor;
    
    // Shows a temporary notification to confirm colour change //
    showNotification(`Colour changed to ${selectedColor}`, 'success');
  });
  
  colorPicker.click();
}

// -- FONT SIZE TOOL -- //
function activateFontSizeTool() {
  const fontSizeDialog = document.createElement('div');
  fontSizeDialog.className = 'font-size-dialog';
  fontSizeDialog.innerHTML = `
    <div class="dialog-content">
      <h3>Font Size</h3>
      <div class="font-size-options">
        <button data-size="12">12px</button>
        <button data-size="14">14px</button>
        <button data-size="16">16px</button>
        <button data-size="18">18px</button>
        <button data-size="20">20px</button>
        <button data-size="24">24px</button>
        <button data-size="32">32px</button>
        <button data-size="48">48px</button>
      </div>
      <button class="close-btn">Close</button>
    </div>
  `;
  
  document.body.appendChild(fontSizeDialog);
  
  // Handles font size selection //
  fontSizeDialog.addEventListener('click', (e) => {
    if (e.target.dataset.size) {
      const size = e.target.dataset.size;
      window.selectedFontSize = size;
      showNotification(`Font size set to ${size}px`, 'success');
    }
    if (e.target.classList.contains('close-btn')) {
      fontSizeDialog.remove();
    }
  });
}

// -- NOTIFICATION POPUPS -- //
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Removes popup after 3 seconds //
  setTimeout(() => {
    notification.classList.add('animate-slide-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// -- FEATURE COMING SOON POPUP -- //
function showFeatureComingSoon(featureName) {
  const popup = document.createElement('div');
  popup.className = 'feature-popup';
  popup.innerHTML = `
    <div class="popup-content red-theme">
      <h3>Coming Soon</h3>
      <p>${featureName} will be available in a future update!</p>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Removes the popup after 1.5 seconds //
  setTimeout(() => {
    popup.classList.add('animate-fade-out');
    const content = popup.querySelector('.popup-content');
    content.classList.add('animate-slide-up');
    setTimeout(() => popup.remove(), 400);
  }, 1500);
}

// -- CANVAS -- //
function constrainAllElementsToCanvas() {
  const sandbox = document.getElementById('sandboxArea');
  const sandboxRect = sandbox.getBoundingClientRect();
  
  // Gets all draggable elements //
  const textBoxes = sandbox.querySelectorAll('.text-box-container');
  const projectCards = sandbox.querySelectorAll('.project-card');
  
  // Constraints the text boxes to the canvas limits //
  textBoxes.forEach(element => {
    const elementRect = element.getBoundingClientRect();
    const currentLeft = parseInt(element.style.left) || 0;
    const currentTop = parseInt(element.style.top) || 0;
    
    const maxLeft = sandboxRect.width - elementRect.width;
    const maxTop = sandboxRect.height - elementRect.height;
    
    const newLeft = Math.max(0, Math.min(maxLeft, currentLeft));
    const newTop = Math.max(0, Math.min(maxTop, currentTop));
    
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
  });
  
  // Constrains the project cards to the canvas //
  projectCards.forEach(element => {
    const elementRect = element.getBoundingClientRect();
    const currentLeft = parseInt(element.style.left) || 0;
    const currentTop = parseInt(element.style.top) || 0;
    
    const maxLeft = sandboxRect.width - elementRect.width;
    const maxTop = sandboxRect.height - elementRect.height;
    
    const newLeft = Math.max(0, Math.min(maxLeft, currentLeft));
    const newTop = Math.max(0, Math.min(maxTop, currentTop));
    
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
  });
}

// -- GLOBAL EXPORTS -- //
window.makeDraggable = makeDraggable;
window.constrainAllElementsToCanvas = constrainAllElementsToCanvas;
window.toggleToolbar = toggleToolbar;