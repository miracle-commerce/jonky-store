if ( typeof QuickAddToCart !== 'function' ) {

	class QuickAddToCart extends HTMLElement {
		constructor(){
			super();
			if ( this.querySelector('product-form') ) {
				this.init();
			}
		}
		init(){
			this.querySelector('product-form').addEventListener('add-to-cart', ()=>{
				if ( ! document.body.classList.contains('template-cart') ) {
					document.getElementById('site-cart-sidebar').show();
					if ( document.getElementById('cart-recommendations') ) {
						document.getElementById('cart-recommendations').generateRecommendations();
					}
					document.querySelectorAll('[data-header-cart-total').forEach(elm=>{
						elm.textContent = document.querySelector('#AjaxCartForm [data-cart-total]').textContent;
					});
					document.querySelectorAll('[data-header-cart-count]').forEach(elm=>{
						elm.textContent = document.querySelector('#AjaxCartForm [data-cart-count]').textContent;
					})
				}
			});
		}
	}

  if ( typeof customElements.get('quick-add-to-cart') == 'undefined' ) {
		customElements.define('quick-add-to-cart', QuickAddToCart);
	}

}

if ( typeof QuickViewProduct !== 'function' ) {

	class QuickViewProduct extends HTMLElement {
		constructor(){
			super();
			if ( this.querySelector('a') ) {
				this.init();
			}
		}
		init(){

			this.quickViewModal = null;
			this.querySelector('a').addEventListener('click', (e)=>{

				e.preventDefault();

				if ( ! this.quickViewModal ) {

					const target = e.currentTarget;

					target.classList.add('working');

					fetch(`${target.getAttribute('href')}${ target.getAttribute('href').includes('?') ? '&' : '?' }view=quick-view`)
						.then(response => response.text())
						.then(text => {

							const quickViewHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('#product-quick-view');

							// create modal w content

							const quickViewContainer = document.createElement('div');
							quickViewContainer.innerHTML = `<modal-box id="modal-${target.dataset.id}"	
								class="modal modal--product" 
								data-options='{
									"enabled": false,
									"showOnce": false,
									"blockTabNavigation": true
								}'
								tabindex="-1" role="dialog" aria-modal="true" 
							>
								<div class="container--medium">
									<div class="modal-content">
										<button class="modal-close" data-js-close data-js-first-focus style="position:absolute;margin:0;top:0;right:0">${window.KROWN.settings.symbols.close}</button>
									</div>
								</div>
								<span class="modal-background" data-js-close></span>
							</modal-box>`;

							this.quickViewModal = quickViewContainer.querySelector('modal-box');
							document.body.appendChild(this.quickViewModal);

							this.quickViewModal.querySelector('.modal-content').innerHTML = quickViewHTML.innerHTML;

							if ( ! window.productPageScripts ) {
									
								const scripts = this.quickViewModal.querySelectorAll('script');
								scripts.forEach(elm=>{
									const script = document.createElement('script');
									script.src = elm.src;
									document.body.append(script);
									window.productPageScripts = true;
								})

							}

							this.quickViewModal.querySelector('.product-quick-view__close').addEventListener('click', ()=>{
								this.quickViewModal.hide();
							});

							if ( this.quickViewModal.querySelector('[data-js-product-form]') ) {
								this.quickViewModal.querySelector('[data-js-product-form]').addEventListener('add-to-cart', ()=>{
									this.quickViewModal.hide();
								});
							}

							setTimeout(()=>{
								this.quickViewModal.show();
								target.classList.remove('working');
							}, 250);
							
						});

				} else {
					this.quickViewModal.show();
				}

			})
		}
	}

  if ( typeof customElements.get('quick-view-product') == 'undefined' ) {
		customElements.define('quick-view-product', QuickViewProduct);
	}

}