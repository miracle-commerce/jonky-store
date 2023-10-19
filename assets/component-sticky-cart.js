class StickyCart extends HTMLElement{
  constructor(){
    super();
    this.addCartButton = this.querySelector("[data-sticky-add-cart]");
    if(this.addCartButton){
      this.addCartButton.addEventListener("click", (e)=>{
        let mainProductForm = document.querySelector("[data-main-product-form]");
        if(mainProductForm){
          mainProductForm.dispatchEvent(new CustomEvent('submit'));
        }
      })

      document.addEventListener("scroll", ()=>{
        this.switchShowHideEl();
      })
    }
  }

  switchShowHideEl(){
    const MainAddToCartButton = document.querySelector("[data-main-product-add-to-cart]");
    let MainAddToCartButtonBottomPos = MainAddToCartButton.getBoundingClientRect().bottom;
    if(MainAddToCartButtonBottomPos < 0 || MainAddToCartButtonBottomPos >= window.innerHeight){
      this.show();
    }else{
      this.remove();
    }
  }

  connectedCallback(){
    this.switchShowHideEl();
  }
  
  show(){
    this.classList.add("sticky-show");
  }

  remove(){
    if(this.classList.contains("sticky-show")){
      this.classList.remove("sticky-show");
    }
  }
}

customElements.define('sticky-add-to-cart', StickyCart);