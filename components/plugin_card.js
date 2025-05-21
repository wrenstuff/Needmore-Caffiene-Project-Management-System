class Plugin_Card extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/card.scss
    this.innerHTML = 
    `
        <h1>PLUGIN CARD (MODIFY IN plugin-card.js)</h1>
    `
    }

}

customElements.define('comp-plugin-card', Plugin_Card);