if ( typeof LocalizationForm !== 'function' ) {
	class LocalizationForm extends HTMLElement {

		constructor(){

			super();

			this.selector = this.querySelector('[data-js-localization-form-button]');
			this.content = this.querySelector('[data-js-localization-form-content]');
			

			if ( this.querySelector('[data-js-localization-form-insert-helper-content]') ) {

				this.selector.addEventListener('click', e=>{
					if ( ! this.classList.contains('populated') ) {
						this.classList.add('populate');
						this.populate();
					}
				})

			}

			this.selector.addEventListener('click', e=>{

				e.stopPropagation();
				e.preventDefault();

				document.querySelectorAll('[data-js-localization-form-content].content-opened').forEach(elm=>{
					if ( elm != e.currentTarget.parentNode.querySelector('[data-js-localization-form-content]') ) {
						elm.classList.remove('content-opened');
						elm.parentNode.style.zIndex = 9;
					}
				});

				if ( ! this.content.classList.contains('content-opened') ) {

					this.content.classList.add('content-opened');
					e.currentTarget.setAttribute('aria-expanded', 'true');
					this.content.parentNode.style.zIndex = 1000;;
					
					if ( this.content.getBoundingClientRect().y + this.content.offsetHeight + 55 > window.innerHeight ) {
						this.content.classList.add('invert-y');
					}
					if ( this.content.getBoundingClientRect().x + this.content.offsetWidth + 55 > window.innerWidth ) {
						this.content.classList.add('invert-x');
					}

					this.onClickHandler = (()=>{
						if ( this.content.classList.contains('content-opened') ) {
							this.content.classList.remove('content-opened', 'invert-x', 'invert-y');
							this.content.parentNode.style.zIndex = 9;
						}
					}).bind(this);
					window.addEventListener('click', this.onClickHandler);

				} else {
					e.currentTarget.setAttribute('aria-expanded', 'false');
					this.content.parentNode.style.zIndex = 9;
					this.content.classList.remove('content-opened', 'invert-x', 'invert-y');
					window.removeEventListener('click', this.onClickHandler);
				}

			});

			this.querySelector('[data-js-localization-form-button]').addEventListener('keydown', function(e){
				if ( e.keyCode == window.KEYCODES.RETURN ) {
					if ( ! this.content.classList.contains('opened-with-tab') ) {
						this.content.classList.add('opened-with-tab');
						this.content.querySelectorAll('[data-js-localization-form-item]').forEach(elm=>{elm.setAttribute('tabindex', '0')});
					}
				}
			});

		}

		populate() {
			fetch('?section_id=helper-localization-form').then(response=>response.text())
				.then(text => {
					const results = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-helper-localization-form').innerHTML;
					this.querySelector('[data-js-localization-form-insert-helper-content]').innerHTML = results;
					if ( this.content.getBoundingClientRect().y + this.content.offsetHeight + 55 > window.innerHeight ) {
						this.content.classList.add('invert-y');
					}
					if ( this.content.getBoundingClientRect().x + this.content.offsetWidth + 55 > window.innerWidth ) {
						this.content.classList.add('invert-x');
					}
				})
				.catch(e=>{
					console.log(e);
				})
		}

	}

	if ( typeof customElements.get('localization-form') == 'undefined' ) {
		customElements.define('localization-form', LocalizationForm);
	}

}