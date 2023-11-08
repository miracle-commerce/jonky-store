// Controleer eerst of we ons op een productpagina bevinden
if (window.location.pathname.includes('/products/')) {
  // Voer de code voor de productpagina uit
  if (typeof ProductQuantity !== 'function') {
    class ProductQuantity extends HTMLElement {
      constructor() {
        super();

        // Zoek de relevante elementen binnen de huidige context van deze custom element
        const qtySelector = this.querySelector('.product-quantity__selector');
        const qtyMinus = this.querySelector('.qty-minus');
        const qtyPlus = this.querySelector('.qty-plus');
        const qtyMin = qtySelector.getAttribute('min')
          ? parseInt(qtySelector.getAttribute('min'))
          : 1;
        const qtyMax = qtySelector.getAttribute('max')
          ? parseInt(qtySelector.getAttribute('max'))
          : 999;

        // Pas de standaardwaarde van qtySelector aan naar 6
        qtySelector.value = 1;
        qtySelector.addEventListener('change', (e)=>{
          console.log(e);
          if(e.detail.synced == false){
            if(this.dataset.stickyCart == 'true'){
              let mainQuantitySelector = document.querySelector("[data-main-product-quantity-selector]");
              if(mainQuantitySelector){
                mainQuantitySelector.querySelector("[name='quantity']").value = qtySelector.value;
                mainQuantitySelector.querySelector("[name='quantity']").dispatchEvent(new CustomEvent('change', {detail:{
                  synced: true
                }}))
              }
            }else if (this.dataset.mainProductQuantitySelector == "true"){
              let stickyCartQtySelector = document.querySelector("product-quantity[data-sticky-cart='true']");
              if(stickyCartQtySelector){
                stickyCartQtySelector.querySelector("[name='quantity']").value = qtySelector.value;
                stickyCartQtySelector.querySelector("[name='quantity']").dispatchEvent(new CustomEvent('change', {detail:{
                  synced: true
                }}))
              }
            }
          }
        })

        if (parseInt(qtySelector.value) - 1 < qtyMin) {
          qtyMinus.classList.add('disabled');
        }
        if (parseInt(qtySelector.value) + 1 > qtyMax) {
          qtyPlus.classList.add('disabled');
        }

        qtyMinus.addEventListener('click', (e) => {
          e.preventDefault();
          if (!qtyMinus.classList.contains('disabled')) {
            const currentQty = parseInt(qtySelector.value);
            if (currentQty - 1 >= qtyMin) {
              qtySelector.value = currentQty - 1;
              qtyPlus.classList.remove('disabled');
            }
            if (currentQty - 1 <= qtyMin) {
              qtyMinus.classList.add('disabled');
            }
            qtySelector.dispatchEvent(new Event("change", { detail: {synced: false}}));
          }
        });

        qtyPlus.addEventListener('click', (e) => {
          e.preventDefault();
          if (!qtyPlus.classList.contains('disabled')) {
            const currentQty = parseInt(qtySelector.value);
            if (currentQty + 1 <= qtyMax) {
              qtySelector.value = currentQty + 1;
              qtyMinus.classList.remove('disabled');
            }
            if (currentQty + 1 >= qtyMax) {
              qtyPlus.classList.add('disabled');
            }
            qtySelector.dispatchEvent(new CustomEvent("change", { detail: {synced: false}}));
          }
        });
      }
    }

    if (typeof customElements.get('product-quantity') === 'undefined') {
      customElements.define('product-quantity', ProductQuantity);
    }
  }
} else {
  // Voer de code voor andere pagina's uit
  if (typeof ProductQuantity !== 'function') {
    class ProductQuantity extends HTMLElement {
      constructor() {
        super();

        const qty = this.querySelector('.qty-selector');
        const qtyMinus = this.querySelector('.qty-minus');
        const qtyPlus = this.querySelector('.qty-plus');
        const qtyMin = qty.getAttribute('min') ? parseInt(qty.getAttribute('min')) : 1;
        const qtyMax = qty.getAttribute('max') ? parseInt(qty.getAttribute('max')) : 999;

        if (parseInt(qty.value) - 1 < qtyMin) {
          qtyMinus.classList.add('disabled');
        }
        if (parseInt(qty.value) + 1 > qtyMax) {
          qtyPlus.classList.add('disabled');
        }

        qtyMinus.addEventListener('click', (e) => {
          e.preventDefault();
          if (!qtyMinus.classList.contains('disabled')) {
            const currentQty = parseInt(qty.value);
            if (currentQty - 1 >= qtyMin) {
              qty.value = currentQty - 1;
              qtyPlus.classList.remove('disabled');
            }
            if (currentQty - 1 <= qtyMin) {
              qtyMinus.classList.add('disabled');
            }
          }
        });

        qtyPlus.addEventListener('click', (e) => {
          e.preventDefault();
          if (!qtyPlus.classList.contains('disabled')) {
            const currentQty = parseInt(qty.value);
            if (currentQty + 1 <= qtyMax) {
              qty.value = currentQty + 1;
              qtyMinus.classList.remove('disabled');
            }
            if (currentQty + 1 >= qtyMax) {
              qtyPlus.classList.add('disabled');
            }
          }
        });
      }
    }

    if (typeof customElements.get('product-quantity') == 'undefined') {
      customElements.define('product-quantity', ProductQuantity);
    }
  }
}
