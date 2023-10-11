if ( typeof ProductVariants !== 'function' ) {

	class ProductVariants extends HTMLElement {

		constructor() {
			super();
			this.init();
		}

		init() {

			this.price = document.querySelector(`#product-price-${this.dataset.id}`);

			if ( this.price ) {
				this.priceOriginal = this.price.querySelector('[data-js-product-price-original]');
				this.priceCompare = this.price.querySelector('[data-js-product-price-compare]');
				this.priceUnit = this.price.querySelector('[data-js-product-price-unit]');
			}

			this.productForm = document.querySelector(`#product-form-${this.dataset.id}`);
			if ( this.productForm ) {
				this.productQty = this.productForm.querySelector('[data-js-product-quantity]');
				this.addToCart = this.productForm.querySelector('[data-js-product-add-to-cart]');
				this.addToCartText = this.productForm.querySelector('[data-js-product-add-to-cart-text]');
			}

			this.addEventListener('change', this.onVariantChange);
			let initVariantChange = false;

			if ( this.hasAttribute('data-variant-required' ) ) {
				this.variantRequired = true;
				this.noVariantSelectedYet = true;
				if ( document.location.search.includes('variant') ) {
					const initVariant = parseInt(new URLSearchParams(document.location.search).get('variant'));
					this.currentVariant = this.getVariantData().find((variant) => {
						if ( variant.id == initVariant ) {
							variant.options.map((option, index) => {
								const variantContainer = this.querySelectorAll(`[data-js-product-variant]`)[index].querySelector(`[data-js-product-variant-container]`);
								if ( variantContainer.dataset.jsProductVariantContainer == 'radio' ) {
									variantContainer.querySelector(`input[value="${option}"]`).checked = true;
								} else if ( variantContainer.dataset.jsProductVariantContainer == 'select' ) {
									variantContainer.value = option;
								}
							})
							return variant;
						}
					});

					if ( this.currentVariant ) {
						this.variantRequired = false;
						this.noVariantSelectedYet = false;
						initVariantChange = true;
					}

				}

			} else {
				this.variantRequired = false;
				this.noVariantSelectedYet = false;
			}

			this.updateOptions();
			this.updateMasterId();
			this.updateUnavailableVariants();

			this.productStock = document.querySelector(`#product-${this.dataset.id} [data-js-variant-quantity]`);
			this.productStockProgress = document.querySelector(`#product-${this.dataset.id} [data-js-variant-quantity-progress]`);
			if ( this.productStock && document.querySelector(`#product-${this.dataset.id} [data-js-variant-quantity-data]`) ) {
				this.productStockData = JSON.parse(document.querySelector(`#product-${this.dataset.id} [data-js-variant-quantity-data]`).dataset.inventory);
			}
			this.updateStock();

			this._event = new Event('VARIANT_CHANGE');

			if ( initVariantChange ) {
				this.onVariantChange();
			}

		}

		onVariantChange(){

			this.updateOptions();
			this.updateMasterId();
			this.updateVariantInput();
			if ( this.price ) {
				this.updatePrice();
			}
			this.updateStock();
			this.updateUnavailableVariants();
			this.updatePickupAvailability();
			if ( ! this.hasAttribute('data-no-history') ) {
				this.updateURL();
			}
			this.updateDetails();

			if ( this.productForm ) {
				if ( ! this.currentVariant || ! this.currentVariant.available ) {
					if ( this.productQty ) this.productQty.style.display = 'none';
					this.addToCart.classList.add('disabled');
					this.productForm.classList.add('disabled-cart');
					this.addToCartText.textContent = KROWN.settings.locales.products_sold_out_variant;
				} else {
					if ( this.productQty ) this.productQty.style.display = '';
					this.addToCart.classList.remove('disabled');
					this.productForm.classList.remove('disabled-cart');
					this.addToCartText.textContent = this.hasAttribute('data-show-bundle-wording') ? KROWN.settings.locales.products_add_to_bundle_button : this.addToCartText.hasAttribute('data-show-preorder-wording') ? KROWN.settings.locales.products_preorder_button : KROWN.settings.locales.products_add_to_cart_button;
				}
				if ( ! this.currentVariant ) {
					this.productForm.classList.add('unavailable-variant');
					this.addToCartText.textContent = (this.variantRequired && this.noVariantSelectedYet) ? KROWN.settings.locales.products_variant_required : KROWN.settings.locales.products_unavailable_variant;
				} else {
					this.productForm.classList.remove('unavailable-variant');
				}
			}
			this.dispatchEvent(this._event);

		}

		updateOptions(){

			this.options = [];

			this.querySelectorAll('[data-js-product-variant-container]').forEach(elm=>{
				if ( elm.dataset.jsProductVariantContainer == 'radio' ) {
					elm.querySelectorAll('.product-variant__input').forEach(el=>{
						if ( el.checked ) {
							this.options.push(el.value);
						}
					});
				} else {
					if ( ! ( this.variantRequired && elm.selectedIndex == 0 ) ) {
						this.options.push(elm.value);
					}
				}
			});

			if ( this.variantRequired && this.noVariantSelectedYet && this.options.length >= parseInt(this.dataset.variants) ) {
				this.noVariantSelectedYet = false;
			}

		}

		updateMasterId(){
			this.currentVariant = this.getVariantData().find((variant) => {
				return !variant.options.map((option, index) => {
					return this.options[index] === option;
				}).includes(false);
			});
		}

		updatePrice(){
			if (!this.currentVariant) {
				if ( ! ( this.variantRequired && this.noVariantSelectedYet ) ) {
					this.priceOriginal.innerHTML = '';
					this.priceCompare.innerHTML = '';
					this.priceUnit.innerHTML = '';
				}
			} else {
				this.priceOriginal.innerHTML = this._formatMoney(this.currentVariant.price, KROWN.settings.shop_money_format);
				if ( this.currentVariant.compare_at_price > this.currentVariant.price ) {
					this.priceCompare.innerHTML = this._formatMoney(this.currentVariant.compare_at_price, KROWN.settings.shop_money_format);
				} else {
					this.priceCompare.innerHTML = '';
				}

				if ( this.currentVariant.unit_price_measurement ) {
					this.priceUnit.innerHTML = `
						${this._formatMoney(this.currentVariant.unit_price, KROWN.settings.shop_money_format)} / 
						${( this.currentVariant.unit_price_measurement.reference_value != 1 ? this.currentVariant.unit_price_measurement.reference_value + ' ' : '' )}
						${this.currentVariant.unit_price_measurement.reference_unit}
					`;
				} else {
					this.priceUnit.innerHTML = '';
				}
			}
		
		}

		updateStock(){

			if (!this.currentVariant) {
				if ( this.productStock ) {
					this.productStock.innerHTML = '';
				}
			} else {
				if ( this.productStock && this.productStockData ) {

					let currentVariant = false;
					for ( const variant of this.productStockData ) {
						if ( variant.id == this.currentVariant.id ) {
							currentVariant = variant;
							break;
						}
					}
					this.productStock.innerHTML = '';

					if ( currentVariant ) {

						if ( currentVariant.quantity <= 0 ) {
							if ( currentVariant.inventory == 'continue' ) {
								this.productStock.innerHTML = KROWN.settings.locales.products_preorder;
								this.productStock.setAttribute('data-stock', 'pre-order');
							} else if ( currentVariant.inventory == 'deny' ) {
								this.productStock.innerHTML = KROWN.settings.locales.products_no_products;
								this.productStock.setAttribute('data-stock', 'out-of-stock');
							}
						} else if ( currentVariant.quantity == '1' ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_one_product;
							this.productStock.setAttribute('data-stock', 'one-item-stock');
						} else if ( currentVariant.quantity <= parseInt(this.productStock.dataset.lowStock) ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_few_products.replace('{{ count }}', currentVariant.quantity);
							this.productStock.setAttribute('data-stock', 'little-stock');
						} else if ( currentVariant.unavailable ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_no_products;
							this.productStock.setAttribute('data-stock', 'out-of-stock');
						} else if ( currentVariant.quantity > parseInt(this.productStock.dataset.lowStock) && this.productStock.dataset.type == "always" ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_many_products.replace('{{ count }}', currentVariant.quantity);
							this.productStock.setAttribute('data-stock', 'in-stock');
						} else if ( ! currentVariant.quantity && this.productStock.dataset.type == "always" )  {
							this.productStock.innerHTML = KROWN.settings.locales.products_enough_products;
							this.productStock.setAttribute('data-stock', 'in-stock');
						}

						if ( this.productStockProgress ) {
							let progressQty = 0;
							if ( currentVariant.quantity <= 0 && currentVariant.inventory == 'continue' || typeof currentVariant.quantity === 'undefined' ) {
								progressQty = parseInt(this.productStock.dataset.highStock);
							} else if ( currentVariant.quantity > 0 ) {
								progressQty = currentVariant.quantity;
							}
							if ( progressQty >= parseInt(this.productStock.dataset.highStock)  ) {
								this.productStockProgress.style.width = `100%`;
							} else {
								this.productStockProgress.style.width = `${100 * progressQty / parseInt(this.productStock.dataset.highStock)}%`;
							}
						}

					}
				}
			}
		}

		updateDetails(){

			document.querySelectorAll(`#product-${this.dataset.id} [data-js-product-sku]`).forEach(elm=>{
				if ( this.currentVariant && this.currentVariant.sku ) {
					elm.innerHTML = KROWN.settings.locales.product_sku + this.currentVariant.sku;
				} else {
					elm.innerHTML = '';
				}
			});

			document.querySelectorAll(`#product-${this.dataset.id} [data-js-product-barcode]`).forEach(elm=>{
				if ( this.currentVariant && this.currentVariant.barcode ) {
					elm.innerHTML = KROWN.settings.locales.product_barcode + this.currentVariant.barcode;
				} else {
					elm.innerHTML = '';
				}
			});
			
		}

		updatePickupAvailability() {
			const pickUpAvailability = document.querySelector('pickup-availability');
			if (!pickUpAvailability) return;

			if (this.currentVariant && this.currentVariant.available) {
				pickUpAvailability.fetchAvailability(this.currentVariant.id);
			} else {
				pickUpAvailability.removeAttribute('available');
				pickUpAvailability.innerHTML = '';
			}
		}

		updateUnavailableVariants(){

			if ( this.dataset.hideVariants != 'false' ) {

				let options1 = {},
						options2 = {},
						options3 = {},

						option1Selected = null,
						option2Selected = null;

				if ( this.dataset.variants > 1 ) {
					option1Selected = this._getSelectedOption(0);
					this._resetDisabledOption(1);
				}
				if ( this.dataset.variants > 2 ) {
					option2Selected = this._getSelectedOption(1);
					this._resetDisabledOption(2);
				}

				this.getVariantData().forEach((el) => {
					if ( this.dataset.variants > 0 ) {
						if ( ! options1[el.option1] ) {
							options1[el.option1] = [];
						}
						options1[el.option1].push(String(el.available));
					}
					if ( this.dataset.variants > 1 ) {
						if ( ! options2[el.option2] ) {
							options2[el.option2] = [];
						}
						options2[el.option2].push(String(el.available));
					}
					if ( this.dataset.variants == 2 ) {
						if ( el.option1 == option1Selected && ! el.available ) {
							this._setDisabledOption(1, el.option2);
						}
					}
					if ( this.dataset.variants > 2 ) {
						if ( ! options3[el.option3] ) {
							options3[el.option3] = [];
						}
						options3[el.option3].push(String(el.available));
						if ( el.option2 == option2Selected && el.option1 == option1Selected && ! el.available ) {
							this._setDisabledOption(2, el.option3);
						}
					}

				});

				if ( this.dataset.variants > 0 ) {
					Object.keys(options1).forEach((key)=>{
						if ( ! options1[key].includes('true') ){
							this._setDisabledOption(0, key);
						}
					});
				}
				if ( this.dataset.variants > 1 ) {
					Object.keys(options2).forEach((key)=>{
						if ( ! options2[key].includes('true') ){
							this._setDisabledOption(1, key);
						}
					});
				}
				if ( this.dataset.variants > 2 ) {
					Object.keys(options3).forEach((key)=>{
						if ( ! options3[key].includes('true') ){
							this._setDisabledOption(2, key);
						}
					});
					Object.keys(options2).forEach((key)=>{
						if ( ! options2[key].includes('true') ){
							if ( option2Selected == key ) {
								if ( this.dataset.hideVariants == 'disable' ) {
									this.querySelectorAll('[data-js-product-variant]')[2].querySelector('.product-variant-value').setAttribute('disabled', 'disabled');
								} else {
									this.querySelectorAll('[data-js-product-variant]')[2].querySelector('.product-variant-value').classList.add('disabled');
								}
							}
						}
					});
				}

			}
		}

		_getSelectedOption(i){
			let selectedOption = null;
			this.querySelectorAll('[data-js-product-variant]')[i].querySelectorAll('[data-js-product-variant-container]').forEach(elm=>{
				if ( elm.dataset.jsProductVariantContainer == 'radio' ) {
					elm.querySelectorAll('.product-variant__input').forEach(el=>{
						if ( el.checked ) {
							selectedOption = el.value;
						}
					});
				} else {
					selectedOption = elm.value;
				}
			});
			return selectedOption;
		}

		_resetDisabledOption(i){
			this.querySelectorAll('[data-js-product-variant]')[i].querySelectorAll('.product-variant-value').forEach((elm)=>{
				elm.classList.remove('disabled');
				elm.classList.remove('hide-variant')
				if ( ! elm.hasAttribute('default') ) {
					elm.removeAttribute('disabled');
				}
				elm.parentNode.classList.remove('hide-variant');
			})
		}

		_setDisabledOption(i,option){
			let variant = this.querySelectorAll('[data-js-product-variant]')[i].querySelector(`.product-variant-value[value="${option.replace('"', '&x22;')}"]`);
			if ( variant ) {
				if ( this.dataset.hideVariants == 'disable' ) {
					variant.setAttribute('disabled', 'disabled');
				} else if ( this.dataset.hideVariants == 'true' ) {
					variant.classList.add('disabled');
				} else if ( this.dataset.hideVariants == 'hide' ) {
					if ( this.querySelectorAll('[data-js-product-variant]')[i].querySelector('[data-js-product-variant-container]').dataset.jsProductVariantContainer == 'radio' ) {
						variant.parentNode.classList.add('hide-variant');
					} else {
						variant.classList.add('hide-variant');
					}
				}
			}
		}

		updateURL(){
			if (!this.currentVariant) return;
			window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
		}

		updateVariantInput() {
			if (!this.currentVariant) return;
			const productForms = document.querySelectorAll(`#product-form-${this.dataset.id}, #product-form-installment`);
			productForms.forEach((productForm) => {
				const input = productForm.querySelector('input[name="id"]');
				input.value = this.currentVariant.id;
				input.dispatchEvent(new Event('change', { bubbles: true }));
			});
		}

		getVariantData() {
			this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
			return this.variantData;
		}

		_formatMoney(cents, format) {

			if (typeof cents === 'string') {
				cents = cents.replace('.', '');
			}
	
			let value = '';
			const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
			const formatString = format || moneyFormat;
	
			function formatWithDelimiters(number, precision, thousands, decimal) {
				thousands = thousands || ',';
				decimal = decimal || '.';
	
				if (isNaN(number) || number === null) {
					return 0;
				}
	
				number = (number / 100.0).toFixed(precision);
	
				const parts = number.split('.');
				const dollarsAmount = parts[0].replace(
					/(\d)(?=(\d\d\d)+(?!\d))/g,
					'$1' + thousands
				);
				const centsAmount = parts[1] ? decimal + parts[1] : '';
	
				return dollarsAmount + centsAmount;
			}
	
			switch (formatString.match(placeholderRegex)[1]) {
				case 'amount':
					value = formatWithDelimiters(cents, 2);
					break;
				case 'amount_no_decimals':
					value = formatWithDelimiters(cents, 0);
					break;
				case 'amount_with_comma_separator':
					value = formatWithDelimiters(cents, 2, '.', ',');
					break;
				case 'amount_no_decimals_with_comma_separator':
					value = formatWithDelimiters(cents, 0, '.', ',');
					break;
				case 'amount_no_decimals_with_space_separator':
					value = formatWithDelimiters(cents, 0, ' ');
					break;
				case 'amount_with_apostrophe_separator':
					value = formatWithDelimiters(cents, 2, "'");
					break;
			}
	
			return formatString.replace(placeholderRegex, value);
	
		}

	}

  if ( typeof customElements.get('product-variants') == 'undefined' ) {
		customElements.define('product-variants', ProductVariants);
	}

}

/* ---
	Product Form
--- */

if ( typeof ProductForm !== 'function' ) {

	class ProductForm extends HTMLElement {
		constructor() {
			super();   
			this.init();
		}

		init(){
			this.cartType = this.hasAttribute('data-ajax-cart') ? 'ajax' : 'page';
			if ( ! document.body.classList.contains('template-cart') || this.hasAttribute('data-force-form' ) ) {
				this.form = this.querySelector('form');
				this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
				this.ADD_TO_CART = new Event('add-to-cart');
			}
			if ( document.body.classList.contains('touchevents') ) {
				const submitButton = this.querySelector('[type="submit"]');
				if ( submitButton ) {
					submitButton.addEventListener('touchend', e=>{
						//submitButton.click();
					});
				}
			}
		}

		onSubmitHandler(e) {	

			e.preventDefault();
			
			const submitButton = this.querySelector('[type="submit"]');

			submitButton.classList.add('working');

			const body = this._serializeForm(this.form);
			let alert = '';

			fetch(`${KROWN.settings.routes.cart_add_url}.js`, {
				body,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Requested-With': 'XMLHttpRequest'
				},
				method: 'POST'
			})
				.then(response => response.json())
				.then(response => {
					if ( response.status == 422 ) {
						// wrong stock logic alert
						alert = document.createElement('span');
						alert.className = 'alert alert--error';
						if ( typeof response.description === 'string' ) {
							alert.innerHTML = response.description;
						} else {
							alert.innerHTML = response.message;
						}
						if ( this.cartType == 'page' ) {
							if ( document.getElementById('product-page-form-error-cart-alert') ) {
								document.getElementById('product-page-form-error-cart-alert').remove();
							}
							alert.style.marginTop = '1em';
							alert.style.marginBottom = '0';
							alert.id = 'product-page-form-error-cart-alert';
							this.form.parentElement.append(alert);
							return false;
						}
						return fetch('?section_id=helper-cart');
					} else {
						if ( this.cartType == 'page' ) {
							document.location.href = KROWN.settings.routes.cart_url;
							return false;
						} else {
							return fetch('?section_id=helper-cart');
						}
					}
				})
				.then(response => response.text())
				.then(text => {

					const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
					const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
					const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

					const cartItems = document.getElementById('AjaxCartForm');
					cartItems.innerHTML = cartFormInnerHTML;
					cartItems.ajaxifyCartItems();

					if ( alert != '' ) {
						document.getElementById('AjaxCartForm').querySelector('form').prepend(alert);
					}

					document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;

					document.querySelectorAll('[data-header-cart-count]').forEach(elm=>{
						elm.textContent = document.querySelector('#AjaxCartForm [data-cart-count]').textContent;
					});
					document.querySelectorAll('[data-header-cart-total').forEach(elm=>{
						elm.textContent = document.querySelector('#AjaxCartForm [data-cart-total]').textContent;
					});
					this.dispatchEvent(this.ADD_TO_CART);

				})
				.catch(e => {
					console.log(e);
				})
				.finally(() => {
					submitButton.classList.remove('working');
				});
		}

		_serializeForm(form) {
			let arr = [];
			Array.prototype.slice.call(form.elements).forEach(function(field) {
				if (
					!field.name ||
					field.disabled ||
					['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
				)
					return;
				if (field.type === 'select-multiple') {
					Array.prototype.slice.call(field.options).forEach(function(option) {
						if (!option.selected) return;
						arr.push(
							encodeURIComponent(field.name) +
								'=' +
								encodeURIComponent(option.value)
						);
					});
					return;
				}
				if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
					return;
				arr.push(
					encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
				);
			});
			return arr.join('&');
		}

	}

  if ( typeof customElements.get('product-form') == 'undefined' ) {
		customElements.define('product-form', ProductForm);
	}

}

/* ---
	Product Recommendations
--- */

if ( typeof ProductRecommendations !== 'function' ) {

	class ProductRecommendations extends HTMLElement {
		constructor() {

			super();  
      
      const event = new Event('product-recommendations-loaded');

      const handleIntersection = (entries, observer) => {

        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        fetch(this.dataset.url)
          .then(response => response.text())
          .then(text => {
            const innerHTML = new DOMParser()
                .parseFromString(text, 'text/html')
                .querySelector('product-recommendations');
                
            if ( innerHTML && innerHTML.querySelectorAll('[data-js-product-item]').length > 0 ) {
              this.innerHTML = innerHTML.innerHTML;
              this.querySelectorAll('form').forEach(elm=>{
                if (elm.querySelector('template')) {
                  elm.append(elm.querySelector('template').content.cloneNode(true));
                }
              });
              this.dispatchEvent(event);
            }
          })
          .catch(e => {
            console.error(e);
          });
      }

			new IntersectionObserver(handleIntersection.bind(this), {rootMargin: `0px 0px 400px 0px`}).observe(this);

		}

	}
	
  if ( typeof customElements.get('product-recommendations') == 'undefined' ) {
		customElements.define('product-recommendations', ProductRecommendations);
	}

}

/* ---
	Gift card recipent
--- */

if ( typeof GiftCardRecipient !== 'function' ) {

	class GiftCardRecipient extends HTMLElement {

		constructor() {

			super();

			const properties = Array.from(this.querySelectorAll('[name*="properties"]'));
			const checkboxPropertyName = 'properties[__shopify_send_gift_card_to_recipient]';

			this.recipientCheckbox = properties.find(input => input.name === checkboxPropertyName);
			this.recipientOtherProperties = properties.filter(input => input.name !== checkboxPropertyName);
			this.recipientFieldsContainer = this.querySelector('.gift-card-recipient__fields');

			this.recipientCheckbox?.addEventListener('change', this.synchronizeProperties.bind(this));
			this.synchronizeProperties();

		}

		synchronizeProperties() {
			this.recipientOtherProperties.forEach(property => property.disabled = !this.recipientCheckbox.checked);
			this.recipientFieldsContainer.classList.toggle('hide', !this.recipientCheckbox.checked);
		}

	}

  if ( typeof customElements.get('gift-card-recipient') == 'undefined' ) {
		customElements.define('gift-card-recipient', GiftCardRecipient);
	}

}