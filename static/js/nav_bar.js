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
                
                <a href="/account-${username}"><img src="/static/images/users/${username}_pfp.jpg" alt="profile image"><p class="account-text">Account</p></a>
                <a href="/logout" class="logout-button" id="logout-link">Logout</a>
            </li>
        </ul>
    </div>
    `;
    // Add event listener to the logout link
    // This will prompt the user for confirmation before logging out
    const logoutLink = this.querySelector('#logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
        if (!confirm('Are you sure you wish to Logout?')) {
            e.preventDefault();
        }
    });
}
    }

}

customElements.define('comp-nav-bar', Nav_Bar);