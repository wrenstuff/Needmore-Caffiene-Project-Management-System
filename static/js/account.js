document.addEventListener("DOMContentLoaded", () => {
    const toggleSections = document.querySelectorAll(".security, .preferences");

    toggleSections.forEach(section => {
        const settingBox = section.querySelector(".setting-box");

        if (settingBox) {
            // Hide by default
            settingBox.style.display = "none";

            // Toggle visibility when parent is clicked
            section.addEventListener("click", (e) => {
                // Prevent toggling if the click is inside a form
                if (e.target.closest("form")) return;

                const isVisible = settingBox.style.display === "block";
                settingBox.style.display = isVisible ? "none" : "block";
            });
        }
    });
});