export function toggleToolbar(toolbarId) { // Toolbar visibility function //
  const toolbar = document.getElementById(toolbarId);
  toolbar.classList.toggle('collapsed');
}