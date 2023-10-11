if ( typeof StoreSelector !== 'function' ) {

  class StoreSelector extends HTMLElement {

    constructor() {

      super();

      this.mainSelector = this.hasAttribute('data-main-selector');
      this.storeSelectorButton = this.mainSelector ? document.querySelector('[data-js-select-store]') : null;
      this.canChangeStore = true;

      const interactiveMap = document.getElementById(this.dataset.mapSelector);

      if ( this.mainSelector && this.hasAttribute('data-single-store') ) {
        localStorage.setItem('selected-store', this.querySelector('.store-selector-item').getAttribute('data-handle'));
      }
      const selectedStore = localStorage.getItem('selected-store');
      let selectedStoreFound = false;
      
      this.storesList = [];
      this.querySelectorAll('.store-selector-item').forEach(elm=>{

        const item = elm;
        this.storesList[item.dataset.handle] = item.dataset.title;

        if ( selectedStore && selectedStore == item.getAttribute('data-handle') ) {

          this._setSelectedStore(item, item);
          this.changeSelectedStoreHandleContent(selectedStore);
          selectedStoreFound = true;

          if ( interactiveMap ) {
            interactiveMap.addEventListener('ready', ()=>{
              setTimeout(()=>{
                new google.maps.event.trigger(interactiveMap.markers[item.dataset.handle], 'click');
              }, 1000);
            })
          }

        }

        if ( ! this.hasAttribute('data-single-store') ) {

          const toggleEl = document.createElement('div');
          toggleEl.classList = `js-accordion-tab-toggle ${this.mainSelector ? 'js-accordion-tab-toggle--main' : ''}`;
          toggleEl.tabIndex = 0;
          toggleEl.innerHTML = KROWN.settings.symbols.toggle_pack_alternate;
          item.querySelector('.js-accordion-tab').appendChild(toggleEl);

          if ( this.mainSelector ) {
            const changeStoreEv = e=>{
              this._clearSelectedStore(item);
              this._setSelectedStore(item, e.target);
              if ( interactiveMap ) {
                if ( item.classList.contains('store-selector-item--store--active') ) {
                  new google.maps.event.trigger(interactiveMap.markers[item.dataset.handle], 'click');
                }
              }
            }
            item.querySelector('.store-selector-item__input-container').addEventListener('click', changeStoreEv);
            item.querySelector('.store-selector-item__input-container').addEventListener('keyup', e=>{
              if ( e.keyCode == window.KEYCODES.RETURN ) {
                changeStoreEv(e);
              }
            });
          }

          const openAccordionEv = () => {
            this._openStoreTab(item);
            this.canChangeStore = false;

            if ( interactiveMap ) {
              if ( item.classList.contains('store-selector-item--active') ) {
                new google.maps.event.trigger(interactiveMap.markers[item.dataset.handle], 'click');
              }
            }

            if ( item.querySelector('css-slider') ) {
              item.querySelector('css-slider').resetSlider();
            }
          }

          item.querySelector(`${this.mainSelector ? '.js-accordion-tab-toggle' : '.js-accordion-tab'}`).addEventListener('click', openAccordionEv);
          item.querySelector(`${this.mainSelector ? '.js-accordion-tab-toggle' : '.js-accordion-tab'}`).addEventListener('keyup', e=>{
            if ( e.keyCode == window.KEYCODES.RETURN ) {
              openAccordionEv();
            }
          });

        }

      });

      if ( this.storeSelectorButton && selectedStoreFound == false ) {
        this.storeSelectorButton.classList.add('show-select-label');
      }

      if ( interactiveMap ) {
        interactiveMap.addEventListener('marker', (e)=>{
          if ( this.canChangeStore ) {
            const item = this.querySelector(`.store-selector-item[data-handle="${e.detail.store}"]`);
            if ( ! item.classList.contains('store-selector-item--store--active' ) ) {
              this._clearSelectedStore(item);
              this._setSelectedStore(item, item);
            }
          } else {
            this.canChangeStore = true;
          }
        });
      }
      
      if ( document.querySelector('[data-js-select-store]') ) {
        const storeChanged = new CustomEvent('storechanged');
        document.querySelector('[data-js-select-store]').addEventListener('click', e=>{
          e.preventDefault();
          if ( this.querySelector('.store-selector-item--store--active') ) {
            const selectedStoreNew = this.querySelector('.store-selector-item--store--active').getAttribute('data-handle');
            localStorage.setItem('selected-store', selectedStoreNew);
            this.changeSelectedStoreHandleContent(selectedStoreNew);
          } else {
            localStorage.removeItem('selected-store');
            this.changeSelectedStoreHandleContent();
          }
          this.dispatchEvent(storeChanged);
        });
      }

    }

    _openStoreTab(item) {
      const open = item.classList.contains('store-selector-item--active') ? false : true;
      this.querySelectorAll('.store-selector-item--active').forEach(elm=>{
        this._slideUp(elm.querySelector('[role=tabpanel]'), 200);
        elm.classList.remove('store-selector-item--active');
      });
      if ( open ) {
        item.classList.add('store-selector-item--active');
        this._slideDown(item.querySelector('[role=tabpanel]'), 200);
      }
    }
    
    _clearSelectedStore(item) {
      if ( ! item.classList.contains('store-selector-item--store--active') && this.querySelector('.store-selector-item--store--active') ) {
        this.querySelector('.store-selector-item--store--active input').checked = false;
        this.querySelector('.store-selector-item--store--active').classList.remove('store-selector-item--store--active');
      }
    }

    _setSelectedStore(item, button) {
      item.classList.toggle('store-selector-item--store--active');
      if ( this.mainSelector ) {
        item.querySelector('input').checked = !item.querySelector('input').checked;
        button.setAttribute('aria-selected', button.getAttribute('aria-selected') == "true" ? "false" : "true");
        if ( this.storeSelectorButton ) {
          if ( item.classList.contains('store-selector-item--store--active') ) {
            this.storeSelectorButton.style.display = "block";
          } else {
            this.storeSelectorButton.style.display = "none";
          }
        }
      }
    }

    changeSelectedStoreHandleContent(store = null) {
      
      if ( this.mainSelector ) {

        document.querySelectorAll('[data-type="store-selector"]').forEach(storeSelectorHandle=>{

          if ( store ) {

            // get closing time

            let storeClosingHours = '';
            if ( document.querySelector('.store-selector-item--store--active .store-selector-item__closing-times') ) {
              const today = new Date().getDay();
              const closingTimes = document.querySelector('.store-selector-item--store--active .store-selector-item__closing-times').querySelectorAll('p');
              if ( closingTimes[today] ) {
                storeClosingHours = ` &nbsp;|&nbsp; ${closingTimes[today].textContent}`;
              }
            }

            storeSelectorHandle.querySelector('[data-store-title]').innerHTML = `${KROWN.settings.locales.store_selector_title_selected}${storeClosingHours}`;
            storeSelectorHandle.querySelector('[data-store-label]').textContent = this.storesList[store];

            if ( this.storeSelectorButton ) {
              this.storeSelectorButton.classList.add('show-change-label');
              this.storeSelectorButton.classList.remove('show-select-label');
            }

          } else {

            storeSelectorHandle.querySelector('[data-store-title]').textContent = KROWN.settings.locales.store_selector_title_default;
            storeSelectorHandle.querySelector('[data-store-label]').textContent = KROWN.settings.locales.store_selector_label;

          }

        })

      }

    }

		_slideUp(target, duration){
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.boxSizing = 'border-box';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			setTimeout(()=>{
				target.style.display = 'none';
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
			}, duration);
		}

		_slideDown(target, duration) {
			target.style.removeProperty('display');
			var display = window.getComputedStyle(target).display;

			if (display === 'none')
				display = 'block';

			target.style.display = display;
			var height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.boxSizing = 'border-box';
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			setTimeout(()=>{
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
			}, duration);
		}

  }

  if ( typeof customElements.get('store-selector') == 'undefined' ) {
    customElements.define('store-selector', StoreSelector);
  }

}