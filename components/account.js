document.addEventListener("DOMContentLoaded", () => {
    const toggleSections = document.querySelectorAll(".security, .preferences");

    toggleSections.forEach(section => {
        const settingBox = section.querySelector(".setting-box");

        if (settingBox) {
            // Hide by default
            settingBox.style.display = "none";

            // Toggle visibility when parent is clicked
            section.addEventListener("click", (e) => {
                // Avoid toggling when clicking on a form input/button inside
                if (e.target.closest("form")) return;

                const isVisible = settingBox.style.display === "block";
                settingBox.style.display = isVisible ? "none" : "block";
            });
        }
    });
});