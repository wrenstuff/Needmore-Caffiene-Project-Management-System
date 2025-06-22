class Nav_Bar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const username = this.getAttribute('data-username');

        // stylesheet for the component can be found at styles/nav-bar.scss
        this.innerHTML =
            `
        <div class="nav-bar">
        <ul class="nav-left">
        <li><a href="/dashboard-${username}">Home</a></li>
            <li><a href="/projects-${username}">Projects</a></li>
            <li><a href="/marketplace-${username}">Marketplace</a></li>
            <li><a href="/pricing-${username}">Membership</a></li>
            <li><a href="/about_us-${username}">About Us</a></li>
            <li><a href="/faq-${username}">FAQ</a></li>
        </ul>
        <ul class="nav-right">
            <li>
                
                <a href="/account-${username}"><img src="/static/images/Blue_test.png" alt="profile image"><p class="account-text">Account</p></a>
            </li>
        </ul>
    </div>
    `
    }

}

customElements.define('comp-nav-bar', Nav_Bar);