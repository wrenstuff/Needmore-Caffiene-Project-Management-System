class Project_Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const uniqueId = this.getAttribute('project-id') || 'default-id';
        const title = this.getAttribute('title') || 'Untitled';
        const owner = this.getAttribute('owner') || 'Unknown';
        const username = this.getAttribute('username') || '';

        this.innerHTML = `
            <div class="project card_w clickable" id="${uniqueId}">
                <div class="notif">
                    <p>9+</p>
                </div>
                <div class="top">
                    <img src="../static/images/Blue_test.png" alt="">
                </div>
                <div class="bottom">
                    <p class="name">Project: ${title}</p>
                    <p class="create">Owned By: ${owner}</p>
                </div>
            </div>
        `;

        // Add click-to-navigate behavior
        this.querySelector('.project').addEventListener('click', () => {
            window.location.href = `/project/${uniqueId}`;

        });

    }
}

customElements.define('comp-project-card', Project_Card);
