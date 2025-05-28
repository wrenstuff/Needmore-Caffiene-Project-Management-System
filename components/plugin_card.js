class Plugin_Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        this.innerHTML = `
            <div class="project card" id="${uniqueId}">
                <div class="add">
                    <img src="../images/icons8-plus-48.png" alt="" class="inactive">
                    <img src="../images/icons8-check-48.png" alt="" class="active hidden">
                </div>
                <div class="top">
                    <img src="../images/Blue_test.png" alt="">
                </div>
                <div class="bottom">
                    <p class="name">Template: NAME</p>
                    <p class="create">Created By: NAME</p>
                </div>
            </div>
        `;

        const addBtn = this.querySelector(`#${uniqueId} .add`);
        const inactiveImg = addBtn.querySelector('.inactive');
        const activeImg = addBtn.querySelector('.active');

        addBtn.addEventListener('click', () => {
            inactiveImg.classList.toggle('hidden');
            activeImg.classList.toggle('hidden');
        });
    }

}

customElements.define('comp-plugin-card', Plugin_Card);