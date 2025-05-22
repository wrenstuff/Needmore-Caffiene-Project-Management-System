class Footer extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/footer.scss
    this.innerHTML = 
    `
    <div class="page-footer">
        <div class="social-media-links">
            <ul>
                <li><a href="https://www.facebook.com" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="facebook"></a></li>
                <li><a href="https://www.twitter.com" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="twitter"></a></li>
                <li><a href="https://www.instagram.com" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="instagram"></a></li>
                <li><a href="https://www.linkedin.com" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="linkedin"></a></li>
                <li><a href="https://www.youtube.com" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="youtube"></a></li>
                <li><a href="mailto:#" target="_blank"><img class="social-icons" src="../images/icon-placeholder.png" alt="email"></a></li>
            </ul>
        </div>
        <div class="contact-info">
            <ul>
                <li><h3>Contact Us</h3></li>
                <li><p><a href="#">123 Coffee Street</a> : Address</p></li>
                <li><p><a href="#">+64 123 123 1234</a> : Phone</p></li>
                <li><p><a href="mailto:#">email@email.com</a> : Email</p></li>
    
            </ul>
        </div>
        <div class="legal-info">
            <ul>
                <li><p><a href="#">Privacy Policy</a></p></li>
                <li><p><a href="#">Terms of Service</a></p></li>
            </ul>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Needmore Caffiene. All rights reserved.</p>
        </div>
    </div>
    `
    }

}

customElements.define('comp-footer', Footer);