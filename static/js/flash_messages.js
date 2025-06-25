//this script handles the display and automatic removal of flash messages
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('.flash-message').forEach(function(msg) {
      msg.style.transition = 'opacity 0.5s';
      msg.style.opacity = '0';
      setTimeout(function() {
        msg.remove();
      }, 500); // Wait for fade-out before removing
    });
  }, 3000); // 3 seconds before starting fade out
});