if ( typeof ShippingCalculator !== 'function' ) {

	class ShippingCalculator extends HTMLElement {

		constructor(){

			super();
			
			const estimateShipping = this.querySelector('.js-estimate-shipping');
			const country = this.querySelector('[name="country"]');
			const province = this.querySelector('[name="province"]');
			const zip = this.querySelector('[name="zip"]');
			const resultsBlock = this.querySelector('.shipping-estimator__results');
			const resultsBlockContent = this.querySelector('.shipping-estimator__results-content');
			const resultsBlockContentList = this.querySelector('.shipping-estimator__results-content ul');
			const resultsBlockContentHeading = this.querySelector('.shipping-estimator__results-content-heading');
			const resultsErrors = this.querySelector('.alert');

			setTimeout(()=>{
				new Shopify.CountryProvinceSelector('shipping-estimator-country', 'shipping-estimator-province', {
					hideElement: 'address_province_container'
				});
			})

			estimateShipping.addEventListener('click', e=>{
				
				e.preventDefault();

				resultsBlockContentList.innerHTML = "";

				fetch("".concat(KROWN.settings.routes.cart_url, "/shipping_rates.json?shipping_address[zip]=").concat(zip.value, "&shipping_address[country]=").concat(country.value, "&shipping_address[province]=").concat(province.value), {
					credentials: 'same-origin',
					method: 'GET'
				}).then(response=>{
					response.json().then(result=>{
						if(result.country || result.zip) {
							resultsBlockContent.style.display = "none";
							resultsBlock.style.display = "block";
							resultsErrors.style.display = "block";
							resultsErrors.innerHTML = "";

							Object.keys(result).forEach(key => {
								resultsErrors.innerHTML += `<li>${result[key]}</li>`;
							});
							
						} else {
							const rates = Object.keys(result.shipping_rates);

							resultsErrors.style.display = "none";
							resultsBlock.style.display = "block";
							resultsBlockContent.style.display = "block";
							
							if(rates.length == 1) {
								resultsBlockContentHeading.innerHTML = KROWN.settings.locales.shipping_calculator_results_heading_one;
							} else {
								resultsBlockContentHeading.innerHTML = KROWN.settings.locales.shipping_calculator_results_heading_one;
							}

							rates.forEach(key => {
								resultsBlockContentList.innerHTML += `<li>${result.shipping_rates[key].name}: ${this._formatMoney(result.shipping_rates[key].price, KROWN.settings.shop_money_format)}</li>`;
							});

						}
					});
				});

			});

			country.addEventListener('change', ()=>{
				resultsBlock.style.display = "none";
			});
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

  if ( typeof customElements.get('shipping-calculator') == 'undefined' ) {
    customElements.define('shipping-calculator', ShippingCalculator);
	}

}