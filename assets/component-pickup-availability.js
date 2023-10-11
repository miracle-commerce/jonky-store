if ( typeof PickupAvailabilityCompact !== 'function' ) {

  class PickupAvailabilityCompact extends HTMLElement {

    constructor(){

      super();
      this.classList.add('active');

      const widgetIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);
        this.fetchAvailability(this.dataset.variantId);
      }
      new IntersectionObserver(widgetIntersection.bind(this), {rootMargin: '0px 0px 50px 0px'}).observe(this);

      this.storeSelector = document.querySelector('store-selector[data-main-selector]');
      window.addEventListener('load', ()=>{
        if ( this.storeSelector ) {
          this.storeSelector.addEventListener('storechanged', e=>{
            this.fetchAvailability(this.dataset.variantId);
          })
        }
      })
      
    }

    fetchAvailability(variantId) {

      const variantSectionUrl = `${this.dataset.baseUrl.endsWith('/')?this.dataset.baseUrl:`${this.dataset.baseUrl}/`}variants/${variantId}/?section_id=helper-pickup-availability-compact`;

      fetch(variantSectionUrl)
        .then(response => response.text())
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');
          this.renderPreview(sectionInnerHTML);
        })
        .catch(e => {
          console.log(e);
        });

    }
    
    renderPreview(sectionInnerHTML) {
      
      const selectedStore = localStorage.getItem('selected-store');

      if ( this.storeSelector && selectedStore && this.storeSelector.storesList[selectedStore] ) {
        // search based on selected store 
        let storeFound = false;
        if ( selectedStore ) {
          sectionInnerHTML.querySelectorAll('.pickup-availability-alert').forEach(elm=>{
            if ( selectedStore == elm.dataset.store ) {
              this.innerHTML = elm.innerHTML.replace('{{ store }}', this.storeSelector.storesList[selectedStore]);
              storeFound = true;
            }
          })
        }
        if ( !storeFound ) {
          this.innerHTML = sectionInnerHTML.querySelector('.pickup-availability-alert[data-default-unavailable]').innerHTML.replace('{{ store }}', this.storeSelector.storesList[selectedStore]);
          storeFound = true;
        }
        if ( !selectedStore || !storeFound ) {
          this.innerHTML = '';
        }
      } else {
        // search based on default store
        this.innerHTML = sectionInnerHTML.querySelector('.pickup-availability-alert[data-default-store]').innerHTML;
      }

    }
    
  }

  if ( typeof customElements.get('pickup-availability-compact') == 'undefined' ) {
    customElements.define('pickup-availability-compact', PickupAvailabilityCompact);
	}

}

if ( typeof PickupAvailabilityExtended !== 'function' ) {

  class PickupAvailabilityExtended extends HTMLElement {

    constructor() {
      super();
      this.classList.add('active');
      this.fetchAvailability(this.dataset.variantId);
    }


    fetchAvailability(variantId) {

      const variantSectionUrl = `${this.dataset.baseUrl.endsWith('/')?this.dataset.baseUrl:`${this.dataset.baseUrl}/`}variants/${variantId}/?section_id=helper-pickup-availability-extended`;

      fetch(variantSectionUrl)
        .then(response => response.text())
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');
          this.renderPreview(sectionInnerHTML);
        })
        .catch(e => {
          console.log(e);
        });

    }

    renderPreview(sectionInnerHTML) {
      const availabilityWidget = sectionInnerHTML.querySelector('#PickupAvailabilityWidget');
      if ( availabilityWidget ) {
        this.innerHTML = availabilityWidget.innerHTML;
        this.querySelectorAll('.pickup-availability-widget__location-view').forEach(elm=>{
          elm.addEventListener('click', ()=>{
            document.getElementById(`${elm.getAttribute('aria-controls')}`).classList.toggle('opened');
            elm.setAttribute('aria-selected', elm.getAttribute('aria-selected') == "true" ? "false" : "true");
          })
        })
      } else {
        console.log('error in availablity fetch');
      }

      const availabilitySidebar = sectionInnerHTML.querySelector('#PickupAvailabilitySidebar');
      if ( availabilitySidebar ) {
        if ( document.querySelector('sidebar-drawer#site-availability-sidebar') ) {
          document.querySelector('sidebar-drawer#site-availability-sidebar').remove();
        } 
        document.body.appendChild(availabilitySidebar.querySelector('#site-availability-sidebar'));
        document.querySelector('.pickup-availability-widget__more').addEventListener('click', e=>{
          e.preventDefault();
          document.getElementById('site-availability-sidebar').show();
        })
      }

    }

  }

  if ( typeof customElements.get('pickup-availability-extended') == 'undefined' ) {
    customElements.define('pickup-availability-extended', PickupAvailabilityExtended);
	}

}