class Footer extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/footer.scss
    this.innerHTML = 
    `
        <h1>Footer (MODIFY IN components/footer.js)</h1>
    `
    }

}

customElements.define('comp-footer', Footer);