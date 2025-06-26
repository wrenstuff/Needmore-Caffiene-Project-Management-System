class Project_Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const uniqueId = this.getAttribute('id') || 'default-id';

        const title = this.getAttribute('title') || 'Untitled';
        const owner = this.getAttribute('owner') || 'Unknown';

        // stylesheet for the component can be found at styles/card.scss
        this.innerHTML =
            `
        <div class="project card_w" id="${uniqueId}">
            <div class="notif">
                <p>9+</p>
            </div>
            <div class="top">
                <img src="../static/images/Blue_test.png" alt="">
            </div>
            <div class="bottom">
                <!-- Project Name -->
                <p class="name">Project: ${title}</p>
                <!-- Owned By -->
                <p class="create">Owned By: ${owner}</p>
            </div>
        </div>
    `;
    }

}

customElements.define('comp-project-card', Project_Card);