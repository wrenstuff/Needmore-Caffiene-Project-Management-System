class Nav_Bar extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/nav-bar.scss
    this.innerHTML = 
    `
        <h1>NAV BAR (MODIFY IN components/nav-bar.js)</h1>
    `
    }

}

customElements.define('comp-nav-bar', Nav_Bar);