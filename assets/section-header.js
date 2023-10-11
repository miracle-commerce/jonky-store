if ( typeof MainHeader !== 'function' ) {

	class MainHeader extends HTMLElement {

		constructor(){
			super();
			this.mount();
		}

		mount(){

			/* -- > DRAWERS < -- */

			document.querySelectorAll('#main > div').forEach(elm=>{
				if ( ! elm.classList.contains('inert-inside') ) {
					elm.setAttribute('data-js-inert', '');
				}
			})
			window.inertElems = document.querySelectorAll('[data-js-inert]');

			// Sticky header

			if ( this.hasAttribute('data-sticky-header') ) {

				const stickyHeader = document.createElement('div');
				stickyHeader.classList = 'sticky-header'
				stickyHeader.innerHTML = `<div class="header__bottom header-container container--large portable-hide">
					${this.querySelector('.header__bottom').innerHTML}
				</div>
				<div class="site-header header__top container--large">
					${this.querySelector('.header__top').innerHTML}
				</div>`;
				document.body.append(stickyHeader);

				window.lst = window.scrollY;
				window.lhp = 0;

				const stickyHeaderDeskBound = this.querySelector('.header__bottom');
				const stickyHeaderMobileBound = this.querySelector('.header__top');

				this.SCROLL_StickyHelper = () =>{
					
					var st = window.scrollY;
					if ( ( st <= 0 || ( window.innerWidth >= 1024 ? stickyHeaderDeskBound.getBoundingClientRect().top >= 0 : stickyHeaderMobileBound.getBoundingClientRect().top >= 0 ) ) && stickyHeader.classList.contains('show') ) {
						stickyHeader.classList.remove('show');
						return;
					}

					if ( st < 0 || Math.abs(lst - st) <= 5 )
						return;	

					if ( st > window.lhp ) {

						if ( st == 0 && stickyHeader.classList.contains('show') ) {

							stickyHeader.classList.remove('show');

						} else if ( st <= lst && ! stickyHeader.classList.contains('show') ) {

							window.lhp = stickyHeader.offsetTop;
							if ( ( window.innerWidth >= 1024 ? stickyHeaderDeskBound.getBoundingClientRect().top : stickyHeaderMobileBound.getBoundingClientRect().top ) < -100 ) {
								stickyHeader.classList.add('show');
							}

						} else if ( st > lst && stickyHeader.classList.contains('show') ) {
							stickyHeader.classList.remove('show');
						}

					} 

					window.lst = st;

				}

				window.addEventListener('scroll', this.SCROLL_StickyHelper, {passive:true});

				stickyHeader.querySelectorAll('.submenu-masonry').forEach(elm=>{
					if ( Macy ) {
						const submenuMacy = new Macy({
							container: elm,
							columns: elm.classList.contains('with-promotion') ? 3 : 4
						});
						setTimeout(()=>{
							submenuMacy.reInit();
						}, 100);
					}
				});
				
			}

			// drawer cart connections

			document.querySelectorAll('[data-js-sidebar-handle]').forEach(elm => {
				if ( elm.hasAttribute('aria-controls') ) {
					const elmSidebar = document.getElementById(elm.getAttribute('aria-controls'));
					elm.addEventListener('click', e=>{
						e.preventDefault();
						elm.setAttribute('aria-expanded', 'true');
						elmSidebar.show();
					})
					elm.addEventListener('keyup', e=>{
						if ( e.keyCode == window.KEYCODES.RETURN ) {
							elm.setAttribute('aria-expanded', 'true');
							elmSidebar.show();
							elmSidebar.querySelector('[data-js-close]').focus();
						}
					})
				}
			})
			
			// closing drawers

			document.querySelectorAll('sidebar-drawer [data-js-close]').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					if ( e.target.closest('.sidebar').classList.contains('sidebar--opened') ) {
						e.target.closest('.sidebar').hide();
					}
				});
			});
			document.querySelector('.site-overlay').addEventListener('click', ()=>{
				if ( document.querySelector('.sidebar--opened') ) {
					document.querySelector('.sidebar--opened').hide();
				}
			});
			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {
					if ( document.querySelector('.sidebar--opened') ) {
						document.querySelector('.sidebar--opened').hide();
					}
				}
			});

			// resizing drawers

			const rootHeight = document.getElementById('root-height');
			this.RESIZE_SidebarHelper = debounce(()=>{
				rootHeight.innerHTML = `:root {
					--window-height: ${window.innerHeight}px;
				}`;
			}, 200);
			window.addEventListener('resize', this.RESIZE_SidebarHelper);
			rootHeight.innerHTML = `:root {
				--window-height: ${window.innerHeight}px;
			}`;

			// Init modal windows

			document.querySelectorAll('[aria-controls="modal-store-selector"]').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					if ( document.querySelector('.sidebar--opened') ) {
						document.querySelector('.sidebar--opened').hide();
					}
					if ( document.getElementById(elm.getAttribute('aria-controls')) ) {
						document.getElementById(elm.getAttribute('aria-controls')).show();
					}
				})
				elm.addEventListener('keyup', e=>{
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						if ( document.querySelector('.sidebar--opened') ) {
							document.querySelector('.sidebar--opened').hide();
						}
						if ( document.getElementById(elm.getAttribute('aria-controls')) ) {
							document.getElementById(elm.getAttribute('aria-controls')).show();
						}
					}
				})
			});

			// Submenu alignment

			const rtl = document.documentElement.getAttribute('dir') == 'rtl';
			document.querySelectorAll('.site-nav.style--classic .has-submenu').forEach(elm=>{
				elm.addEventListener('mouseover', ()=>{
					if ( elm.querySelector('.normal-menu') ) {
						elm.querySelector('.normal-menu').style.left = `${rtl ? elm.getBoundingClientRect().right : elm.getBoundingClientRect().left}px`;
					}
				})
			})

			// predictive search

			if ( JSON.parse(document.getElementById('shopify-features').text).predictiveSearch ) {
				document.querySelectorAll('search-form [data-js-search-input]').forEach(elm=>{
					elm.addEventListener('focus', ()=>{
						document.getElementById(elm.dataset.jsFocusOverlay).classList.add('active');
						if ( ! document.body.classList.contains('predictive-script-loaded') ) {
							document.body.classList.add('predictive-script-loaded')
							const predictiveSearchJS = document.createElement('script');
							predictiveSearchJS.src = KROWN.settings.predictive_search_script;
							document.head.appendChild(predictiveSearchJS); 
						}
					})
					elm.addEventListener('keydown', e=>{
						if ( e.keyCode == window.KEYCODES.TAB ) {
							if ( document.getElementById('search-results-overlay-desktop').classList.contains('active') ) {
								document.getElementById('search-results-overlay-desktop').classList.remove('active');
							}
						}
					})
				})
				window.addEventListener('load', ()=>{
					document.querySelectorAll('.search-results-overlay').forEach(elm=>{
						elm.style = '';
					})
				});
			} else {
				document.querySelector('search-form [data-js-search-input] + button').classList.add('button--invisibile-trigger');
			}

			// touch navigation for the menu

			const closeTouchSubmenus = (focusedElm, focusedParent=null)=>{
				document.querySelectorAll('.style--classic li.focus').forEach(elm=>{
					if ( ! ( elm === focusedElm || elm === focusedParent ) ) {
						elm.classList.remove('focus');
					}
				})
			}
			let babyMenuTouch = false;
			document.querySelectorAll('.style--classic .has-babymenu').forEach(elm=>{
				elm.addEventListener('touchstart', e=>{
					elm.firstElementChild.style.pointerEvents = 'none';
					elm.classList.toggle('focus');
					babyMenuTouch = true;
					closeTouchSubmenus(elm,elm.closest('.has-submenu'));
				})
			})
			document.querySelectorAll('.style--classic .has-submenu').forEach(elm=>{
				if ( ! elm.classList.contains('mega-link') ) {
					elm.addEventListener('touchstart', e=>{
					elm.firstElementChild.style.pointerEvents = 'none';
					if ( ! babyMenuTouch ) {
						elm.classList.toggle('focus');
						closeTouchSubmenus(elm);
					}
						babyMenuTouch = false;
					})
				}
			})

			// tab navigation for the menu

			document.querySelectorAll('.site-nav.style--classic .has-submenu > a').forEach(childEl=>{

				const elm = childEl.parentNode;

				elm.addEventListener('keydown', e=>{

					if ( e.keyCode == window.KEYCODES.RETURN ) {
						if ( ! e.target.classList.contains('no-focus-link') ) {
							e.preventDefault();
						}
						if ( ! elm.classList.contains('focus') ) {
							elm.classList.add('focus');
							elm.setAttribute('aria-expanded', 'true');
						} else if ( document.activeElement.parentNode.classList.contains('has-submenu') && elm.classList.contains('focus') ) {
							elm.classList.remove('focus');
							elm.setAttribute('aria-expanded', 'true');
						}
					}
				});	
				
				if ( elm.querySelector('.submenu-holder > li:last-child a') ) {
					elm.querySelector('.submenu-holder > li:last-child a').addEventListener('focusout', e=>{
						if ( elm.classList.contains('focus') ) {
							elm.classList.remove('focus');
							elm.setAttribute('aria-expanded', 'false');
						}
					});
				}

			});

			document.querySelectorAll('.site-nav.style--classic .has-babymenu:not(.mega-link) > a').forEach(childEl=>{	

				const elm = childEl.parentNode;

				elm.addEventListener('keydown', e=>{
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						if ( ! e.target.classList.contains('no-focus-link') ) {
							e.preventDefault();
						}
						if ( ! elm.classList.contains('focus') ) {
							elm.classList.add('focus');
							elm.setAttribute('aria-expanded', 'true');
						} else {
							elm.classList.remove('focus');
							elm.setAttribute('aria-expanded', 'false');
						}
					}
				});

				if ( elm.querySelector('.babymenu li:last-child a') ) {
					elm.querySelector('.babymenu li:last-child a').addEventListener('focusout', e=>{
						if ( elm.parentNode.classList.contains('focus') ) {
							elm.parentNode.classList.remove('focus');
							elm.parentNode.setAttribute('aria-expanded', 'false');
						}
					});
				}

			})

		}

		unmount(){
			window.removeEventListener('resize', this.RESIZE_SidebarHelper);
		}

	}
	
  if ( typeof customElements.get('main-header') == 'undefined' ) {
		customElements.define('main-header', MainHeader);
	}

}

if ( typeof SidebarDrawer !== 'function' ) {

	class SidebarDrawer extends HTMLElement {

		constructor(){
			super();
			this.querySelector('[data-js-close]').addEventListener('click', ()=>{
				this.hide();
			});
			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {
					const openedSidebar = document.querySelector('sidebar-drawer.sidebar--opened');
					if ( openedSidebar ){
						openedSidebar.hide();
					}
				}
			});
		}

		/* 
			* generic hide/show functions 
		*/

		show(){

			this.opened = true;
			document.body.classList.add('sidebar-opened');
			if ( this.classList.contains('sidebar--right') ) {
				document.body.classList.add('sidebar-opened--right');
			} else if ( this.classList.contains('sidebar--left') ) {
				document.body.classList.add('sidebar-opened--left');
			}
			this.style.display = 'grid';
			setTimeout(()=>{
				this.classList.add('sidebar--opened');
				window.inertElems.forEach(elm=>{
					elm.setAttribute('inert', '');
				})
			}, 15);
			if ( this.id == "site-cart-sidebar" ) {
				if ( document.querySelector('#cart-recommendations css-slider') ) {
					document.querySelector('#cart-recommendations css-slider').resetSlider();
				}
			}

		}

		hide(){

			this.opened = false;
			this.classList.remove('sidebar--opened');

			document.body.classList.remove('sidebar-opened');
			document.body.classList.remove('sidebar-opened--left');
			document.body.classList.remove('sidebar-opened--right');
			window.inertElems.forEach(elm=>{
				elm.removeAttribute('inert');
			})

			document.querySelector(`[aria-controls="${this.id}"]`).setAttribute('aria-expanded', 'false');

			setTimeout(()=>{
				this.style.display = 'none';
			}, 501);

		}

	}


  if ( typeof customElements.get('sidebar-drawer') == 'undefined' ) {
		customElements.define('sidebar-drawer', SidebarDrawer);
	}

}

if ( typeof MobileNavigation !== 'function' ) {
		
	class MobileNavigation extends HTMLElement {

		constructor() {

			super();

			this._openedFirstSubmenu = false;
			this._openedSecondSubmenu = false;

			this.querySelectorAll('.has-submenu > a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					if ( ! this._openedFirstSubmenu ) {
						this._openedFirstSubmenu = true;
						this.classList.add('opened-first-submenu');
						this.closest('sidebar-drawer').scrollTo({top: 0});
					}
					e.target.closest('li').classList.add('opened');
					this._resizeContainer();
				})
			});

			this.querySelectorAll('.has-babymenu > a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					if ( ! this._openedSecondSubmenu ) {
						this._openedSecondSubmenu = true;
						this.classList.add('opened-second-submenu');
						this.closest('sidebar-drawer').scrollTo({top: 0});
					}
					e.target.closest('li').classList.add('opened');
					this._resizeContainer();
				})
			});

			this.querySelectorAll('.submenu-back a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					if ( this._openedSecondSubmenu ) {
						this._openedSecondSubmenu = false;
						this.classList.remove('opened-second-submenu');
						this._resizeContainer();
					} else if ( this._openedFirstSubmenu ) {
						this._openedFirstSubmenu = false;
						this.classList.remove('opened-first-submenu');
						this._resizeContainer(true);
					}
					this.closest('sidebar-drawer').scrollTo({top: 0});
					setTimeout(()=>{
						e.target.closest('li.opened').classList.remove('opened');
					}, 301);
					e.preventDefault();
				})
			});

			if ( this.dataset.showHeaderActions == 'true' ) {

				const mobileNavActions = document.createElement('div');
				mobileNavActions.classList = "header-actions flex-buttons";
				mobileNavActions.innerHTML = document.querySelector('[data-js-header-actions]').innerHTML;
				this.querySelector('nav').prepend(mobileNavActions);
				
				mobileNavActions.querySelectorAll('[data-modal]').forEach(elm=>{
					elm.addEventListener('click', e=>{
						e.preventDefault();
						if ( document.querySelector('.sidebar--opened') ) {
							document.querySelector('.sidebar--opened').hide();
						}
						if ( document.getElementById(elm.getAttribute('aria-controls')) ) {
							document.getElementById(elm.getAttribute('aria-controls')).show();
						}
					})
				});
				
			}

		}

		_resizeContainer(main=false){
      if ( main ) {
				this.style.height = `auto`;
      } else {
				if ( this._openedSecondSubmenu ) {
					this.style.height = `${this.querySelector('.has-babymenu.opened .babymenu').scrollHeight}px`;
				} else if ( this._openedFirstSubmenu ) {
					this.style.height = `${this.querySelector('.has-submenu.opened .submenu').scrollHeight}px`;
				}  
      }
		}

	}

  if ( typeof customElements.get('mobile-navigation') == 'undefined' ) {
		customElements.define('mobile-navigation', MobileNavigation);
	}

}

if ( typeof ScrollableNavigation !== 'function' ) {

	class ScrollableNavigation extends HTMLElement {

		constructor() {

			super();

			this.linkList = this.querySelector('.link-list');
			this.header = this.parentNode;
			window.addEventListener('resize', debounce(()=>{
				this.checkNav();
			}, 200));
			this.checkNav();

			const rtl = document.documentElement.getAttribute('dir') == 'rtl';

			this.parentNode.querySelector('.scrollable-navigation-button--left').addEventListener('click', ()=>{
				this.scroll({
					top: 0,
					left: this.scrollLeft - (rtl ? -100 : 100),
					behavior: 'smooth'
				});
			})
			this.parentNode.querySelector('.scrollable-navigation-button--right').addEventListener('click', ()=>{
				this.scroll({
					top: 0,
					left: this.scrollLeft + (rtl ? -100 : 100),
					behavior: 'smooth'
				});
			})

		}

		checkNav() {
			if ( this.linkList.scrollWidth > this.offsetWidth ) {
				this.header.classList.add('scrolling-navigation-enabled');
			} else {
				this.header.classList.remove('scrolling-navigation-enabled');
			}
		}
		
	}

  if ( typeof customElements.get('scrollable-navigation') == 'undefined' ) {
		customElements.define('scrollable-navigation', ScrollableNavigation);
	}

}


