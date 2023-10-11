if (typeof ScrollingText !== "function") {
	class ScrollingText extends HTMLElement {
		constructor() {
			super();

			var ScrollingText = (function () {
				function getWidth(element) {
					var rect = element.getBoundingClientRect();
					return rect.right - rect.left;
				}

				function ScrollingText(box, speed) {
					var inner_element = (box.children && box.children[0]) || null;
					if (!inner_element) throw "No child node found";

					inner_element.style.position = "relative";

					this.position = 0;
					this.speed = speed;
					this.box_width = getWidth(box);
					this.inner_element_width = getWidth(inner_element);
					this.box = box;
					this.inner_element = inner_element.cloneNode(true);
					setUpChildrens.call(this);
				}

				function refreshWidths() {
					this.box_width = getWidth(this.box);
					this.inner_element_width = getWidth(this.box.children[0]);
				}

				function calculateNumElements() {
					return Math.ceil(this.box_width / this.inner_element_width) + 1;
				}

				function setUpChildrens() {
					var qty = calculateNumElements.call(this);
					if (qty > this.box.children.length) {
						for (var i = this.box.children.length; i < qty; i++)
							this.box.appendChild(this.inner_element.cloneNode(true));
					} else if (qty < this.box.children.length) {
						for (var i = qty; i < this.box.children.length; i++)
							this.box.removeChild(this.box.lastChild);
					}
				}

				function nextFrame(delta, direction) {
					var self = this;
					refreshWidths.call(this);
					setUpChildrens.call(this);
					Array.prototype.forEach.call(this.box.children, function (el) {
						if (direction == "rtl") {
							el.style.transform = `translateX(${self.position}px)`;
						} else {
							el.style.transform = `translateX(${-self.position}px)`;
						}
					});
					this.position += (this.speed * delta) / 1000;
					if (this.position >= this.inner_element_width)
						this.position = this.position % this.inner_element_width;
				}

				ScrollingText.prototype = {
					start: function (direction, speed) {
						this._running = true;
						var self = this;
						var last_time = null;
						var loop_func = function () {
							if (!self._running) return;
							var now = Date.now();
							var delta = last_time === null ? 0 : now - last_time;
							nextFrame.call(self, delta, direction, speed);
							last_time = now;
							window.requestAnimationFrame(loop_func);
						};
						window.requestAnimationFrame(loop_func);
					},

					stop: function () {
						this._running = false;
					},
				};

				return ScrollingText;
			})();

			const speed = window.innerWidth > 768 ? parseInt(this.dataset.scrollingSpeed) : parseInt(this.dataset.scrollingSpeed) / 1.5;
			const direction = this.dataset.scrollingDirection;
			const scrolling_text = new ScrollingText(this, speed, direction);
			// scrolling_text.start(direction);
			
			if(this.dataset.pauseOnHover == "true") {
				const carusel = this;
				let windowInFocus = true;

				window.addEventListener("blur", function() {
					windowInFocus = false;
				});

				window.addEventListener("focus", function() {
					windowInFocus = true;
				});

				carusel.addEventListener('mouseover', isMouseOver);
				carusel.addEventListener('mouseout', isMouseOut);


				function isMouseOver() {
					if (windowInFocus) {
						scrolling_text.stop();
					}
				}

				function isMouseOut() {
					if (windowInFocus) {
						scrolling_text.start(direction);
					}
				}

			}

			const intersectionObserver = new IntersectionObserver(entries => {
				if ( entries[0].isIntersecting ) {
					scrolling_text.start(direction);
				} else {
					scrolling_text.stop();
				}
			});
			intersectionObserver.observe(this);


		}
	}

	if (typeof customElements.get("scrolling-text") == "undefined") {
		customElements.define("scrolling-text", ScrollingText);
	}
}
