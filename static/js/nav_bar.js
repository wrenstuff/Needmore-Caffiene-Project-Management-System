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
            <li><a href="{{ url_for('dashboard') }}">Home</a></li>
            <li><a href="{{ url_for('projects') }}">Projects</a></li>
            <li><a href="{{ url_for('marketplace') }}">Marketplace</a></li>
            <li><a href="{{ url_for('marketplace') }}">Membership</a></li>
            <li><a href="{{ url_for('about') }}">About Us</a></li>
            <li><a href="{{ url_for('faq') }}">FAQ</a></li>
        </ul>
        <ul class="nav-right">
            <li><a href="{{ url_for('account') }}">Account</a></li>
        </ul>
    </div>
    `
    }

}

customElements.define('comp-nav-bar', Nav_Bar);