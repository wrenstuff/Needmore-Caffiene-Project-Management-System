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
            <li><a href="/dashboard">Home</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/pricing">Membership</a></li>
            <li><a href="/about_us">About Us</a></li>
            <li><a href="/faq">FAQ</a></li>
        </ul>
        <ul class="nav-right">
            <li>
                
                <a href="/account"><img src="/static/images/Blue_test.png" alt="profile image"><p class="account-text">Account</p></a>
            </li>
        </ul>
    </div>
    `
    }

}

customElements.define('comp-nav-bar', Nav_Bar);