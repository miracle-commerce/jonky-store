// Voorbeeld van een debounce-functie
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}


if ( typeof CartForm !== 'function' ) {
	class CartForm extends HTMLElement {

		constructor(){
			super();
			this.ajaxifyCartItems();
		}

		ajaxifyCartItems(){

			this.form = this.querySelector('form');

			this.querySelectorAll('[data-js-cart-item]').forEach(item=>{

				const remove = item.querySelector('.remove');
				if ( remove ) {
					remove.dataset.href = remove.getAttribute('href');
					remove.setAttribute('href', '');
					remove.addEventListener('click', (e)=>{
						e.preventDefault();
						this.updateCartQty(item, 0);
					})
				}

				const qty = item.querySelector('.qty');
				if ( qty ) {
					qty.addEventListener('input', debounce(e=>{
						e.preventDefault();
						e.target.blur();
						this.updateCartQty(item, parseInt(qty.value));
					}, 300));
					qty.addEventListener('click', (e)=>{
						e.target.select();
					})
				}

			})

		}

		updateCartQty(item, newQty){

			let alert = null;

			this.form.classList.add('processing');
			if ( this.querySelector('.alert') ) {
				this.querySelector('.alert').remove();
			}

			const body = JSON.stringify({
				id: item.dataset.id,
				quantity: newQty
			});

			fetch(KROWN.settings.routes.cart_change_url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Accept': 'application/javascript' },
					body
				})
				.then(response => response.json())
				.then(response => {
					if ( response.status == 422 ) {
						// wrong stock logic alert
						alert = document.createElement('span');
						alert.classList.add('alert', 'alert--error');
						if ( typeof response.description === 'string' ) {
							alert.innerHTML = response.description;
						} else {
							alert.innerHTML = response.message;
						}
					}
					return fetch('?section_id=helper-cart');
				})
				.then(response => response.text())
				.then(text => {

					const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
					const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
					const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

					const cartItems = document.getElementById('AjaxCartForm');
					cartItems.innerHTML = cartFormInnerHTML;
					cartItems.ajaxifyCartItems();

					document.querySelectorAll('[data-header-cart-count]').forEach(elm=>{
						elm.textContent = cartItems.querySelector('[data-cart-count]').textContent;
					});
					document.querySelectorAll('[data-header-cart-total').forEach(elm=>{
						elm.textContent = cartItems.querySelector('[data-cart-total]').textContent;
					});

					if ( alert !== null ) {
						this.form.prepend(alert);
					} 

					document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;
							
					const event = new Event('cart-updated');
					this.dispatchEvent(event);

				})
				.catch(e => {
					console.log(e);
					let alert = document.createElement('span');
					alert.classList.add('alert', 'alert--error');
					alert.textContent = KROWN.settings.locales.cart_general_error;
					this.form.prepend(alert);
				})
				.finally(() => {
					this.form.classList.remove('processing');
				});
		}

	} 


  if ( typeof customElements.get('cart-form') == 'undefined' ) {
		customElements.define('cart-form', CartForm);
	}

}

if ( typeof CartProductQuantity !== 'function' ) {

	class CartProductQuantity extends HTMLElement {
		constructor(){
			super();
			this.querySelector('.qty-minus').addEventListener('click', this.changeCartInput.bind(this));
			this.querySelector('.qty-plus').addEventListener('click', this.changeCartInput.bind(this));
		}
		changeCartInput(){
			setTimeout(()=>{
				document.getElementById('AjaxCartForm').updateCartQty(this.closest('[data-js-cart-item]'), parseInt(this.querySelector('.qty').value));
			}, 50);
		}
	}

  if ( typeof customElements.get('cart-product-quantity') == 'undefined' ) {
		customElements.define('cart-product-quantity', CartProductQuantity);
	}

}

// method for apps to tap into and refresh the cart

if ( ! window.refreshCart ) {

	window.refreshCart = () => {
		
		fetch('?section_id=helper-cart')
			.then(response => response.text())
			.then(text => {

			const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
			const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
			const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

			const cartItems = document.getElementById('AjaxCartForm');
			cartItems.innerHTML = cartFormInnerHTML;
			cartItems.ajaxifyCartItems();

			document.querySelectorAll('[data-header-cart-count]').forEach(elm=>{
				elm.textContent = cartItems.querySelector('[data-cart-count]').textContent;
			});
			document.querySelectorAll('[data-header-cart-total').forEach(elm=>{
				elm.textContent = cartItems.querySelector('[data-cart-total]').textContent;
			})
			
			document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;
			if ( document.querySelector('[data-js-site-cart-sidebar]') ) {
				document.querySelector('[data-js-site-cart-sidebar]').show();
			}

			if ( document.querySelector('cart-recommendations') ) {
				document.querySelector('cart-recommendations').innerHTML = '';
				document.querySelector('cart-recommendations').generateRecommendations();
			}

		})

	}

}