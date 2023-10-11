if ( typeof ImageHotspots !== 'function' ) {

  class ImageHotspots extends HTMLElement {

    constructor(){
			
      super();

      this.daysEl = this.querySelector('.days');
			this.zIndex = 9;
			      
      this.hotspots = this.querySelectorAll(
				".image-hotspots__spot--bullet"
			);
			let previoushotspot = null;

			this.hotspots.forEach((hotspot) => {
				hotspot.addEventListener("click", (event) => {
					if (previoushotspot && previoushotspot !== event.target) {
						previoushotspot.classList.remove("active");
					}
					event.target.classList.toggle("active");
					event.target.parentNode.style.zIndex = this.zIndex++;
					previoushotspot = event.target;
					event.stopPropagation();
				});
			});

			document.addEventListener("click", (event) => {
				this.hotspots.forEach((hotspot) => {
					hotspot.classList.remove("active");
				});
				previoushotspot = null;
			});

    }

  }

  if ( typeof customElements.get('image-hotspots') == 'undefined' ) {
    customElements.define('image-hotspots', ImageHotspots);
  }

}

if ( Shopify.designMode ) {
	document.addEventListener("shopify:block:select", (e) => {
		const block = e.target;
		if ( block.classList.contains("image-hotspots__spot") ) {
			const bulletElements = document.querySelectorAll(
				".image-hotspots__spot--bullet"
			);
			bulletElements.forEach((bulletElement) => {
				bulletElement.classList.remove("active");
			});
			const activeBullet = block.querySelector('.image-hotspots__spot--bullet');
			activeBullet.classList.add('active');
		}
	})
}