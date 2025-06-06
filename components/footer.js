class Footer extends HTMLElement {
    constructor() {
        super();
    }

connectedCallback() {

    // stylesheet for the component can be found at styles/footer.scss
    this.innerHTML = 
    `
        <footer class="footerContainer">
            <div class="socialIcons">
                <a href="#"><i class="fa fa-twitter"></i></a>
                <a href="#"><i class="fa fa-instagram"></i></a>
                <a href="#"><i class="fa fa-facebook"></i></a>
                <a href="#"><i class="fa fa-youtube"></i></a>
                <a href="#"><i class="fa fa-linkedin"></i></a>
                <a href="#"><i class="fa fa-envelope"></i></a>

            </div>
            <div class="footerBottom">
                <div class="copyrightText">Copyright Text</div>
                <div class="links">
                    <a href="#">ts and cs</a>
                    <a href="#">privacy policy</a>
                </div>
                <div class="contactInfo">
                    <p><strong>contact info</strong></p>
                    <p>213 Banana Street : address</p>
                    <p>123 123 12345 : ph</p>
                    <p><a href="mailto:email@email.com">email@email.com</a> : email</p>
                </div>
            </div>
        </footer>
        ;
    `
    }

}

customElements.define('comp-footer', Footer);