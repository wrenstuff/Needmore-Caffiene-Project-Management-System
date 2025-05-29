class Project_Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        // stylesheet for the component can be found at styles/card.scss
        this.innerHTML =
        `
        <div class="project card" id="${uniqueId}">
            <div class="notif">
                <p>9+</p>
            </div>
            <div class="top">
                <img src="../images/Blue_test.png" alt="">
            </div>
            <div class="bottom">
                <!-- Project Name -->
                <p class="name">Project: ${uniqueId}</p>
                <!-- Owned By -->
                <p class="create">Owned By: NAME</p>
            </div>
        </div>
    `
    }

}

customElements.define('comp-project-card', Project_Card);