class Nav_Bar extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/nav-bar.scss
    this.innerHTML = 
    `
        <div class="nav-bar">
        <ul class="nav-left">
            <li><a href="dashboard.html">Home</a></li>
            <li><a href="projects.html">Projects</a></li>
            <li><a href="marketplace.html">Marketplace</a></li>
            <li><a href="pricing.html">Membership</a></li>
            <li><a href="about_us.html">About Us</a></li>
            <li><a href="faq.html">FAQ</a></li>
        </ul>
        <ul class="nav-right">
            <li><a href="account.html">Account</a></li>
        </ul>
    </div>
    `
    }

}

customElements.define('comp-nav-bar', Nav_Bar);