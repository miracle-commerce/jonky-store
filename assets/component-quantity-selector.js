// Controleer eerst of we ons op een productpagina bevinden
if (window.location.pathname.includes('/products/')) {
  // Voer de code voor de productpagina uit
  if (typeof ProductQuantity !== 'function') {
    class ProductQuantity extends HTMLElement {
      constructor() {
        super();

        // Zoek de relevante elementen binnen de huidige context van deze custom element
        const ProductId = this.dataset.productId;
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

        if (parseInt(qtySelector.value) - 1 < qtyMin) {
          qtyMinus.classList.add('disabled');
        }
        if (parseInt(qtySelector.value) + 1 > qtyMax) {
          qtyPlus.classList.add('disabled');
        }

        this.addEventListener("updateQuantityController", (e)=>{
          const newQuantity = e.detail.quantity;
          if(newQuantity == qtyMin){
            qtyMinus.classList.add('disabled');
          }else if(newQuantity > qtyMin && qtyMinus.classList.contains('disabled')){
            qtyMinus.classList.remove('disabled');
          }

          if(newQuantity == qtyMax){
            qtyPlus.classList.add('disabled');
          }else if(newQuantity < qtyMax && qtyPlus.classList.contains('disabled'));
            qtyPlus.classList.remove('disabled');
        })

        qtyMinus.addEventListener('click', (e) => {
          e.preventDefault();
          const newQty = parseInt(qtySelector.value) - 1; 
          if(newQty >= qtyMin){
            qtySelector.value = newQty; 
            this.dispatchEvent(new CustomEvent("updateQuantityController", {detail: {
              quantity: newQty
            }}));

            if(ProductId){
              document.querySelectorAll(`product-quantity[data-product-id='${ProductId}']`).forEach((productQtyBox)=>{
                if(ProductQuantity !== this){
                  var SiblingProductQuantity = productQtyBox;
                  var SiblingQtySelector = SiblingProductQuantity.querySelector(".product-quantity__selector");

                  if(SiblingProductQuantity){
                    SiblingQtySelector.value = newQty;
                    SiblingProductQuantity.dispatchEvent(new CustomEvent("updateQuantityController", {detail: {
                      quantity: newQty
                    }}))
                  }
                }
              })
            }

            
          }
        });

        qtyPlus.addEventListener('click', (e) => {
          e.preventDefault();
          const newQty = parseInt(qtySelector.value) + 1; 
          if(newQty <= qtyMax){
            qtySelector.value = newQty; 
            this.dispatchEvent(new CustomEvent("updateQuantityController", {detail: {
              quantity: newQty
            }}));

            if(ProductId){
              document.querySelectorAll(`product-quantity[data-product-id='${ProductId}']`).forEach((productQtyBox)=>{
                if(ProductQuantity !== this){
                  var SiblingProductQuantity = productQtyBox;
                  var SiblingQtySelector = SiblingProductQuantity.querySelector(".product-quantity__selector");

                  if(SiblingProductQuantity){
                    SiblingQtySelector.value = newQty;
                    SiblingProductQuantity.dispatchEvent(new CustomEvent("updateQuantityController", {detail: {
                      quantity: newQty
                    }}))
                  }
                }
              })
            }
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