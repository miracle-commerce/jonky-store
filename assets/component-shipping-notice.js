if ( typeof ShippingNotice !== 'function' ) {

  class ShippingNotice extends HTMLElement {

    constructor() {
      super();
      this.init();
    }

    init() {

      const freeShippingThreshold = Number(this.getAttribute('data-free-shipping'));
      const cartTotal = Number(this.getAttribute('data-cart-total-amount'));
      const freeShippingRemaining = cartTotal - Math.round(freeShippingThreshold * (Shopify.currency.rate ? Number(Shopify.currency.rate) : 1));
      let shippingMessage = '';
      let shippingSuccess = false

      if ( freeShippingRemaining < 0 ) {
        shippingMessage = window.KROWN.settings.locales.shipping_notice_remaining_to_free.replace('{{ remaining_amount }}', this._formatMoney(Math.abs(freeShippingRemaining), KROWN.settings.shop_money_format));

      } else {
        shippingMessage = window.KROWN.settings.locales.shipping_notice_eligible_for_free;
        shippingSuccess = true;
      }

      if ( this.hasAttribute('data-show-alert') ) {
        this.innerHTML = `
          <div class="alert alert--wide alert--${shippingSuccess ? 'success' : 'note'}">
            ${shippingMessage}
          </div>`;
      } else {
        this.innerHTML = shippingMessage;
      }

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

  if ( typeof customElements.get('shipping-notice') == 'undefined' ) {
    customElements.define('shipping-notice', ShippingNotice);
  }

}