if ( typeof VideoPopup !== 'function' ) {

  class VideoPopup extends HTMLElement {

    constructor(){
      
      super();

      this.querySelector('[data-js-video-popup-link]').addEventListener('click',e=>{

        e.preventDefault();

        const blackout = document.createElement('div');
        blackout.classList.add('video-popup__blackout');
        this.append(blackout);
        setTimeout(()=>{
          blackout.style.opacity = '1';
        },10)

        this.classList.add('video-opened');

        if ( this.querySelector('[data-js-video-popup-close]') ) {
          this.querySelector('[data-js-video-popup-close]').addEventListener('click', e=>{
            this.querySelectorAll('iframe, video').forEach(elm=>{elm.remove()});
            blackout.remove();
            this.classList.remove('video-opened');
          })
        }

        setTimeout(()=>{
          this.querySelector('[data-js-video-popup-container]').appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
          setTimeout(()=>{
            this._playMedia(this.closest('[data-video]'));
          }, 500);
        },50);

      });

    }

    _playMedia(media){
			switch ( media.dataset.productMediaType ) {
				case 'video':
					if ( media.querySelector('video') ) {
						media.querySelector('video').play();
					}
					break;
				case 'external_video-youtube':
					if ( media.querySelector('.js-youtube') ) {
						media.querySelector('.js-youtube').contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
					}
					break;
				case 'external_video-vimeo':
					if ( media.querySelector('.js-vimeo') ) {
						media.querySelector('.js-vimeo').contentWindow.postMessage('{"method":"play"}', '*');
					}
					break;
			}
		}

  }

  if ( typeof customElements.get('video-popup') == 'undefined' ) {
    customElements.define('video-popup', VideoPopup);
  }

}