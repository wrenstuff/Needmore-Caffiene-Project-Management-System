class Project_Card extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/card.scss
    this.innerHTML = 
    `
        <h1>PROJECT CARD (MODIFY IN project-card.js)</h1>
    `
    }

}

customElements.define('comp-project-card', Project_Card);