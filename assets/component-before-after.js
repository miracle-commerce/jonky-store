if (typeof BeforeAfter !== "function") {
	class BeforeAfter extends HTMLElement {
		constructor() {
			super();

			this.container = this.querySelector(".before-after");
			this.slider = this.querySelector(".before-after__slider");
			

			this.slider.addEventListener("input", (e) => {
				this.container.style.setProperty('--position', `${e.target.value}%`);
			});

			this.slider.addEventListener("change", (e) => {
				this.container.style.setProperty('--position', `${e.target.value}%`);
			});
		}

	}

	if (typeof customElements.get("before-after") == "undefined") {
		customElements.define("before-after", BeforeAfter);
	}
}
