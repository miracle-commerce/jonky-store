if ( typeof ProductImageZoom !== 'function' ) {
	class ProductImageZoom extends HTMLElement {

		constructor(){

			super();

			if ( ! document.getElementById('zoom') ) {
				this.zoom = document.createElement('div');
				this.zoom.id = 'zoom';
				this.zoom.innerHTML = `
					<img />
					<span class="zoom__exit">${KROWN.settings.symbols.zoom_out}</span>
					<span class="zoom__loader">${KROWN.settings.symbols.zoom_loader}</span>
					<div class="zoom__overlay"></div>
				`;
				document.body.append(this.zoom);
				this.zoom.querySelector('.zoom__exit').addEventListener('click', this._productZoomUnmount.bind(this));
			} else {
				this.zoom = document.getElementById('zoom');
			}

			this.onMouseMoveHandlerBinded = this.onMouseMoveHandler.bind(this);
			this.onResizeHandlerBinded = this.onResizeHandler.bind(this);

			this.addEventListener('click', (e)=>{
				this.zoom.classList.add('opened');
				this.image = this.zoom.querySelector('img');
				this.image.src = this.getAttribute('data-image');
				if ( this.image.naturalWidth > 0 ) {
					this._productZoomMount();
				} else {
					this.image.addEventListener('load', this._productZoomMount.bind(this));
				}
			});

		}

		onMouseMoveHandler(e){
			window.clientX = e.clientX;
			window.clientY = e.clientY;
			const x = e.clientX * ( window.innerWidth - this.image.offsetWidth ) / window.innerWidth;
			const y = e.clientY * ( window.innerHeight - this.image.offsetHeight ) / window.innerHeight;
			this.image.style.left = x + 'px';
			this.image.style.top = y + 'px';
		}

		onResizeHandler(){

			const rf = window.innerWidth > 768 ? 1 : 2;

			if ( this.image.classList.contains('portrait') ) {
				this.image.style.width = ( window.innerWidth*rf ) + 'px';
				this.image.style.height = ( window.innerWidth*rf / this.image.dataset.ratio ) + 'px';
			} else {

				this.image.style.height = ( window.innerHeight*rf ) + 'px';
				this.image.style.width = ( window.innerHeight*rf * this.image.dataset.ratio ) + 'px';

				if ( this.image.offsetWidth < window.innerWidth ) {
					this.image.style.width = ( window.innerWidth*rf ) + 'px';
					this.image.style.height = ( window.innerWidth*rf / this.image.dataset.ratio ) + 'px';
				}

			}

			const x = window.clientX * ( window.innerWidth - this.image.offsetWidth ) / window.innerWidth;
			const y = window.clientY * ( window.innerHeight - this.image.offsetHeight ) / window.innerHeight;

		}

		_productZoomMount(image) {

			this.image.style.left = 0;
			this.image.style.top = 0;

			window.addEventListener('mousemove', this.onMouseMoveHandlerBinded, {passive:true});

			this.image.dataset.ratio = this.image.naturalWidth / this.image.naturalHeight;
			window.addEventListener('resize', this.onResizeHandlerBinded, {passive:true});
			this.onResizeHandler();

			setTimeout(()=>{
				if ( document.body.classList.contains('touch') || document.body.classList.contains('touchevents') ) {
					this.zoom.scrollTop = ( window.innerHeight - this.image.offsetHeight ) / -2;
					this.zoom.scrollLeft = ( window.innerWidth - this.image.offsetWidth ) / -2;
				}
				this.zoom.classList.add('loaded');
			}, 50);

		}

		_productZoomUnmount() {

			this.zoom.classList.remove('opened');

			setTimeout(()=>{
				window.removeEventListener('resize', this.onResizeHandlerBinded);
				window.removeEventListener('mousemove', this.onMouseMoveHandlerBinded);
				const image = document.querySelector('#zoom img');
				image.src = '';
				image.className = '';
				image.style = '';
				this.zoom.classList.remove('loaded');
			}, 300);

		}

	}

  if ( typeof customElements.get('product-image-zoom') == 'undefined' ) {
		customElements.define('product-image-zoom', ProductImageZoom);
	}

}