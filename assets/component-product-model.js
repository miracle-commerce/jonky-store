if ( typeof ProductModel !== 'function' ) {

  class ProductModel extends HTMLElement {
    constructor() {
      super();  
      Shopify.loadFeatures([
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: this.setupModelViewerUI.bind(this),
        },
      ]);
    }
    setupModelViewerUI(errors) {

      if (errors) return;
      this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
      const modelViewerEl = this.modelViewerUI.viewer;

      modelViewerEl.addEventListener('shopify_model_viewer_ui_toggle_play', ()=>{
        if ( modelViewerEl.closest('.css-slider-holder') ) {
          modelViewerEl.closest('.css-slider-holder').classList.add('css-slider--disable-dragging');
        }        
      });

      modelViewerEl.addEventListener('shopify_model_viewer_ui_toggle_pause', ()=>{
        if ( modelViewerEl.closest('.css-slider-holder') ) {
          modelViewerEl.closest('.css-slider-holder').classList.remove('css-slider--disable-dragging');
        }        
      });

      if ( modelViewerEl.closest('.product-gallery-item') && modelViewerEl.closest('.product-gallery-item').dataset.index == '0' ) {
        if ( modelViewerEl.closest('.css-slider-holder') ) {
          modelViewerEl.closest('.css-slider-holder').classList.add('css-slider--disable-dragging');
        }  
      }
    }

  }

  if ( typeof customElements.get('product-model') == 'undefined' ) {
    customElements.define('product-model', ProductModel);
	}

}

if ( ! window.ProductModel ) {

  window.ProductModel = {
    loadShopifyXR() {
      Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: this.setupShopifyXR.bind(this),
        },
      ]);
    },

    setupShopifyXR(errors) {
      
      if (errors) return;
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', () =>
          this.setupShopifyXR()
        );
        return;
      }
      document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
        window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
        modelJSON.remove();
      });
      window.ShopifyXR.setupXRElements();
    }
  }

}

window.addEventListener('load', ()=>{
  document.querySelectorAll('.shopify-model-viewer-ui__controls-overlay').forEach(elm=>{
    elm.style.opacity = 1;
  })
})