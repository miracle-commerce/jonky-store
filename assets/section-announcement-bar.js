if ( typeof AnnouncementBar !== 'function' ) {

  class AnnouncementBar extends HTMLElement {

    constructor() {

      super();

      this.slider = this.querySelector('[data-js-slider]');
      this.content = this.querySelectorAll('.announcement');
      this.nextButton = this.querySelector('.announcement-bar__content-nav--right');
      this.prevButton = this.querySelector('.announcement-bar__content-nav--left');

      this.index = 0;
      this.length = this.content.length;
      
      if ( this.nextButton ) {
        this.nextButton.addEventListener('click', ()=>{
          this.changeSlide('next');
        });
      }
      if ( this.prevButton ) {
        this.prevButton.addEventListener('click', ()=>{
          this.changeSlide('prev');
        });
      }
      
    }

    changeSlide(direction) {

      this.nextButton.classList.remove('announcement-bar__content-nav--disabled')
      this.prevButton.classList.remove('announcement-bar__content-nav--disabled')

      if ( direction == 'next' ) {
        this.index++;
      } else if ( direction == 'prev' ) {
        this.index--;
      }

      if ( this.index == this.length - 1 ) {
        this.nextButton.classList.add('announcement-bar__content-nav--disabled')
      } else if ( this.index == 0 ) {
        this.prevButton.classList.add('announcement-bar__content-nav--disabled')
      }

      this.slider.scrollTo({
        top: 0,
        left: this.content[this.index].offsetLeft,
        behavior: 'smooth'
      });

    }

  }

  if ( typeof customElements.get('announcement-bar') == 'undefined' ) {
    customElements.define('announcement-bar', AnnouncementBar);
	}

}