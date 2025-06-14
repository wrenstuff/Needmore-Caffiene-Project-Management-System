class FAQ extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        this.innerHTML = `
            <div class="faq-box" id="${uniqueId}">
                <div class="question">
                    <h2>Random question that has a simple answer</h2>
                </div>
                <div class="answer hidden">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ullamcorper tellus quam, eu gravida lorem pellentesque non. Duis lacinia ante quis erat ultricies, sit amet venenatis nulla lobortis. Donec tellus tortor, bibendum vel sollicitudin sed, vulputate in massa. Quisque iaculis mattis porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur scelerisque faucibus neque, sed semper magna egestas nec. Etiam eget congue lectus. Aenean posuere est vel augue cursus auctor. Aliquam auctor tristique aliquam. Donec egestas dolor nec tristique consectetur. Pellentesque et maximus nunc. Duis a mollis arcu. Fusce ante magna, tincidunt nec ante id, sollicitudin vulputate orci. Duis fermentum eleifend arcu eget bibendum.
                    </p>
                </div>
            </div>
        `;

        const question = this.querySelector('.question');
        const answer = this.querySelector('.answer');

        question.addEventListener('click', () => {
            answer.classList.toggle('hidden');
        });
    }
}

customElements.define('comp-faq', FAQ);