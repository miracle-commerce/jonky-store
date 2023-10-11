if ( typeof ModalBox !== 'function' ) {
	class ModalBox extends HTMLElement {

		constructor() {

			window.inertElems = document.querySelectorAll('[data-js-inert]');

			super();
			this.o = {
				...{
					show: 10, 
					frequency: 'day', 
					enabled: true,
					showOnce: true,
					closeByKey: true,
					disableScroll: true,
					blockTabNavigation: false,
					openedModalBodyClass: 'modal-opened',
				}, ...JSON.parse(this.dataset.options)
			};
			
			if ( this.o.enabled ) {
			
				this._modalKey = `modal-${document.location.hostname}-${this.id}`;
				this._modalStorage = ! localStorage.getItem(this._modalKey) ? 'empty' : JSON.parse(localStorage.getItem(this._modalKey));
				if ( this.querySelector('[data-content]') ) {
					this._modalText = this.querySelector('[data-content]').textContent;
				}

				const timeNow = new Date().getTime();
				const inBetween = Math.round((timeNow - this._modalStorage['shown']) / 1000);

				let showModal = false;

				if ( this._modalStorage == 'empty'
					|| ( this.o.frequency == 'day' && inBetween > 86400 )
					|| ( this.o.frequency == 'week' && inBetween > 604800 )
					|| ( this.o.frequency == 'month' && inBetween > 2419200 )
					|| this._modalStorage['content'] != this._modalText
				) {
					showModal = true
				}

				if ( showModal ) {
					setTimeout(()=>{
						this.show();
					}, parseInt(this.o.show*1000));
					setTimeout(()=>{
						this.querySelectorAll('[data-js-close]').forEach(elm=>elm.addEventListener('click',()=>{this.hide(this.o.showOnce)}));
					}, 100);
				}

			} else {
				this.querySelectorAll('[data-js-close]').forEach(elm=>elm.addEventListener('click',()=>{this.hide(this.o.showOnce)}));
			}

			if ( this.o.closeByKey ) {
				document.addEventListener('keydown', e=>{
					if ( e.keyCode == 27 ) {
						if ( this.classList.contains('active') ) {
							this.hide(this.o.showOnce);
						}
					}
				});
			}

		}

		show(){
			this.setAttribute('style', '');
			setTimeout(()=>{
				this.classList.add('active');
				if ( this.o.disableScroll ) {
					document.body.classList.add(this.o.openedModalBodyClass);
				}
				if ( this.o.blockTabNavigation ) {
					window.inertElems.forEach(elm=>{
						elm.setAttribute('inert', '');
					});
				}
			}, 10);
			setTimeout(()=>{
				if ( this.querySelector('[data-js-first-focus]') ) {
					this.querySelector('[data-js-first-focus]').focus();
				}
			}, 250);
		}
		hide(remember=false){
			this.classList.remove('active');
			document.body.classList.remove(this.o.openedModalBodyClass);
			setTimeout(()=>{
				this.style.display = 'none';
			}, 500);
			if ( remember && ! Shopify.designMode ){
				localStorage.setItem(this._modalKey, JSON.stringify({
					'shown': (new Date().getTime()),
					'content': this._modalText
				}));
			}
			window.inertElems.forEach(elm=>{
				elm.removeAttribute('inert');
			});
		}

	}


  if ( typeof customElements.get('modal-box') == 'undefined' ) {
		customElements.define('modal-box', ModalBox);
	}

	// Shopify events

	document.addEventListener('shopify:section:select', (e)=>{
		if ( e.target.classList.contains('mount-popup') ) {
			e.target.querySelector('modal-box').style.display = 'block';
			e.target.querySelector('modal-box').show();
		}
	});
	document.addEventListener('shopify:block:select', (e)=>{
		if ( e.target.hasAttribute('data-modal-box') ) {
			e.target.style.display = 'block';
			e.target.show();
		}
	});
	document.addEventListener('shopify:block:deselect', (e)=>{
		if ( e.target.hasAttribute('data-modal-box') ) {
			e.target.hide();
		}
	});
	document.addEventListener('shopify:section:deselect', (e)=>{
		if ( e.target.classList.contains('mount-popup') ) {
			e.target.querySelector('modal-box').hide();
		}
	});

}