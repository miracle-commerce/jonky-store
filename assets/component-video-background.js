
if ( typeof VideoBackgroundElement !== 'function' ) {

  class VideoBackgroundElement extends HTMLElement {

    constructor(){

      super();

      this._eventSuccess = new Event('success');
      this._eventFail = new Event('fail');
      const video = this.querySelector('video');
      video.addEventListener('error', e=>{
        this.switchFallback();
      })
      video.addEventListener('playing', e=>{
        if ( ! this.classList.contains('loaded') ) {
          this.classList.add('loaded');
          this.dispatchEvent(this._eventSuccess);
        }
      })
      video.addEventListener('stalled', e=>{
        if ( ! this.classList.contains('loaded') ) {
          this.switchFallback();
        }
      })

      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        if ( ( entries[0].target.querySelector('video-background-element') && ! entries[0].target.querySelector('video-background-element').classList.contains('loaded') ) || ( entries[0].tagName == 'video-background-element') && ! entries[0].target.classList.contains('loaded') ) {
          video.querySelectorAll('source').forEach(elm=>{
            elm.src = elm.dataset.src;
          });
          video.load();
        }
        observer.unobserve(this);
      }

      if ( this.getBoundingClientRect().y < window.innerHeight || this.parentNode.getBoundingClientRect().y < window.innerHeight ) {
        video.querySelectorAll('source').forEach(elm=>{
          elm.src = elm.dataset.src;
        });
        video.load();
      } else {
        new IntersectionObserver(handleIntersection.bind(this), {rootMargin: `0px 0px 400px 0px`}).observe(this);
        new IntersectionObserver(handleIntersection.bind(this), {rootMargin: `0px 0px 400px 0px`}).observe(this.parentElement);
      }
      
    }

    switchFallback(){
      const fallback = this.parentElement.querySelector(`[data-video-background-fallback][data-id="${this.dataset.id}"]`);
      if ( fallback ) {
        fallback.append(fallback.querySelector('template').content.cloneNode(true));
        fallback.querySelector('img').setAttribute('srcset', fallback.querySelector('img').getAttribute('srcset'));
      }
      this.dispatchEvent(this._eventFail);
    }

  }

  if ( typeof customElements.get('video-background-element') == 'undefined' ) {
    customElements.define('video-background-element', VideoBackgroundElement);
  }

}

document.addEventListener('shopify:section:load', e=>{
  if ( e.target.classList.contains('mount-video-background') ) {
    setTimeout(()=>{
      e.target.querySelectorAll('video-background-element').forEach(elm=>{
        elm.querySelectorAll('source').forEach(source=>{
          source.src = source.dataset.src;
        })
        elm.querySelector('video').load();
      });
    }, 500);
  }
});