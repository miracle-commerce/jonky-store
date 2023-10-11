
// Range Slider - https://www.cssscript.com/custom-range-slider-input/

!function(a){"object"==typeof exports&&"undefined"!=typeof module?module.exports=a():"function"==typeof define&&define.amd?define([],a):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).rangeSlider=a()}(function(){return(function d(e,f,b){function c(a,k){if(!f[a]){if(!e[a]){var i="function"==typeof require&&require;if(!k&&i)return i(a,!0);if(g)return g(a,!0);var j=new Error("Cannot find module '"+a+"'");throw j.code="MODULE_NOT_FOUND",j}var h=f[a]={exports:{}};e[a][0].call(h.exports,function(b){return c(e[a][1][b]||b)},h,h.exports,d,e,f,b)}return f[a].exports}for(var g="function"==typeof require&&require,a=0;a<b.length;a++)c(b[a]);return c})({1:[function(b,a,c){a.exports=(c,b={})=>{let v=a=>!isNaN(a)&& +a+""==a+"",d=(a=0,b=0)=>({min:a,max:b}),w=a=>{[U,V].forEach(a)},x=(a,b,c)=>{if(a)return b;c()},y=(a,b,c="")=>{a.setAttribute(b,c)},z=(a,b)=>{a.removeAttribute(b)},e=(a,b,c,d=!0)=>{a.addEventListener(b,c,d?{passive:!1,capture:!0}:{})},a=(a,c)=>{b[a]=({}).hasOwnProperty.call(b,a)?b[a]:c},A=(a,c)=>b.orientation===X?a:c,B=a=>1===a?ab.max:ab.min,i=()=>{let a=!1;v(b.min)&&v(b.max)||(a=!0),b.min=a?1:+b.min,b.max=a?1:+b.max},j=()=>{b.thumbsDisabled instanceof Array?(1===b.thumbsDisabled.length&&b.thumbsDisabled.push(!1),1!==b.thumbsDisabled.length&&2!==b.thumbsDisabled.length&&(b.thumbsDisabled=[!1,!1])):b.thumbsDisabled=[b.thumbsDisabled,b.thumbsDisabled],b.thumbsDisabled[0]=!!b.thumbsDisabled[0],b.thumbsDisabled[1]=!!b.thumbsDisabled[1]},k=(a,c=!1,g=!0)=>{let e=d(ak[ab.min].value,ak[ab.max].value);a=a||e,ak[ab.min].value=a.min,ak[ab.max].value=ai||c?a.max:a.min+ag,C(),aa.min>aa.max&&(ab.min=+!ab.min,ab.max=+!ab.max,z(u[ab.min],r),z(u[ab.max],q),y(u[ab.min],q),y(u[ab.max],r),ai&&(ai=ai===U?V:U),C()),af=c?aa:a;let f=!1;(e.min!==ak[ab.min].value||c)&&(f=!0),(e.max!==ak[ab.max].value||c)&&(f=!0),f&&(g&&b.onInput&&b.onInput([aa.min,aa.max]),H(),D(),E(),F())},C=()=>{w(a=>{aa[a]=+ak[ab[a]].value})},D=()=>{w(a=>{u[ab[a]].style[A("top","left")]=`calc(${(aa[a]-b.min)/s*100}% + ${(.5-(aa[a]-b.min)/s)*A(ad,ac)[a]}px)`})},E=()=>{let a=(.5-(aa.min-b.min)/s)*A(ad,ac).min/c[`client${A("Height","Width")}`],d=(.5-(aa.max-b.min)/s)*A(ad,ac).max/c[`client${A("Height","Width")}`];t.style[A("top","left")]=`${((aa.min-b.min)/s+a)*100}%`,t.style[A("height","width")]=`${((aa.max-b.min)/s-(aa.min-b.min)/s-a+d)*100}%`},l=()=>{w((a,c)=>{ae[a]=b.thumbsDisabled[c]?aa[a]:b[a]})},m=()=>{w((c,a)=>{b.disabled||b.thumbsDisabled[a]?z(u[B(a)],Y):y(u[B(a)],Y,0)})},F=()=>{w(a=>{y(u[ab[a]],"aria-valuemin",b.min),y(u[ab[a]],"aria-valuemax",b.max),y(u[ab[a]],"aria-valuenow",aa[a]),y(u[ab[a]],"aria-valuetext",aa[a])})},n=()=>{b.disabled?y(c,_):z(c,_)},o=()=>{b.thumbsDisabled.forEach((b,c)=>{let a=B(c);b?(y(u[a],_),y(u[a],"aria-disabled",!0)):(z(u[a],_),y(u[a],"aria-disabled",!1))})},G=(a,c=!1)=>{b[a]=c,i(),w(a=>{ak[0][a]=b[a],ak[1][a]=b[a]}),s=b.max-b.min,k("",!0),l()},p=()=>{b.orientation===X?y(c,$):z(c,$),t.style[A("left","top")]="",t.style[A("width","height")]="",u[0].style[A("left","top")]="",u[1].style[A("left","top")]=""},H=()=>{w(a=>{ac[a]=S(T(u[ab[a]]).width),ad[a]=S(T(u[ab[a]]).height)})},I=(e,d)=>{let a=(d[`offset${A("Top","Left")}`]+(e[`client${A("Y","X")}`]-d.getBoundingClientRect()[A("top","left")])-(ai?(.5-(aa[ai]-b.min)/s)*A(ad,ac)[ai]:0))/c[`client${A("Height","Width")}`]*s+b.min;return a<b.min?b.min:a>b.max?b.max:a},J=(a,b)=>!a.target.classList.contains(b),K=c=>{let e=!1;if(!b.disabled&&(J(c,"range-slider__thumb")&&J(c,"range-slider__range")||b.rangeSlideDisabled&&J(c,"range-slider__thumb"))&&(e=!0),e&&b.thumbsDisabled[0]&&b.thumbsDisabled[1]&&(e=!1),e){let a=I(c,t),f=R(aa.min-a),g=R(aa.max-a);if(b.thumbsDisabled[0])a>=aa.min&&(k(d(aa.min,a),!0),M(c,ab.max,u[ab.max]));else if(b.thumbsDisabled[1])a<=aa.max&&(k(d(a,aa.max),!0),M(c,ab.min,u[ab.min]));else{let h=ab.max;f===g?k(d(aa.min,a),!0):(k(d(f<g?a:aa.min,g<f?a:aa.max),!0),h=f<g?ab.min:ab.max),M(c,h,u[h])}}},L=(b,a)=>{H(),y(a,Z),aj=I(b,a),ah=!0},M=(c,a,d)=>{b.disabled||b.thumbsDisabled[B(a)]||(L(c,d),ai=ab.min===a?U:V,b.onThumbDragStart&&b.onThumbDragStart())},N=a=>{b.disabled||b.rangeSlideDisabled||(L(a,t),ag=aa.max-aa.min,ai=!1,b.onRangeDragStart&&b.onRangeDragStart())},O=i=>{if(ah){let e=I(i,t),h=e-aj,f=aa.min,g=aa.max,a=ai?ae.min:b.min,c=ai?ae.max:b.max;ai&&ai!==U||(f=ai?e:af.min+h),ai&&ai!==V||(g=ai?e:af.max+h),f>=a&&f<=c&&g>=a&&g<=c?(k({min:f,max:g}),aj=e):(f>c&&ai&&(k(d(c,c)),aj=e),g<a&&ai&&(k(d(a,a)),aj=e),f<a&&(ai?k(d(a,aa.max)):k(d(a,aa.max-aa.min+a)),aj=e),g>c&&(ai?k(d(aa.min,c)):k(d(aa.min-aa.max+c,c)),aj=e)),ai||l()}},P=()=>{let a=S(ak[0].step);return ak[0].step===W?W:0===a||isNaN(a)?1:a},Q=(c,f)=>{let g=(37===f||40===f?-1:1)*A(-1,1);if(!b.disabled&&!b.thumbsDisabled[B(c)]){let a=P();a=a===W?1:a;let d=aa.min+a*(ab.min===c?g:0),e=aa.max+a*(ab.max===c?g:0);d>ae.max&&(d=ae.max),e<ae.min&&(e=ae.min),k({min:d,max:e},!0)}},R=Math.abs,S=parseFloat,T=window.getComputedStyle,U="min",V="max",W="any",X="vertical",Y="tabindex",q="data-lower",r="data-upper",Z="data-active",$="data-vertical",_="data-disabled",aa=d(),ab=d(0,1),ac=d(),ad=d(),ae=d(),af=d(),s=0,ag=0,ah=!1,ai=!1,aj=0;if(!this.cssInjected){let f=document.createElement("style");f.textContent=".range-slider{touch-action:none;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;cursor:pointer;display:block;position:relative;width:100%;height:8px;background:#ddd;border-radius:4px}.range-slider[data-vertical]{height:100%;width:8px}.range-slider[data-disabled]{opacity:.5;cursor:not-allowed}.range-slider .range-slider__thumb{position:absolute;z-index:3;top:50%;width:24px;height:24px;transform:translate(-50%,-50%);border-radius:50%;background:#2196f3}.range-slider .range-slider__thumb:focus-visible{outline:0;box-shadow:0 0 0 6px rgba(33,150,243,.5)}.range-slider[data-vertical] .range-slider__thumb{left:50%}.range-slider .range-slider__thumb[data-disabled]{z-index:2}.range-slider .range-slider__range{position:absolute;z-index:1;transform:translate(0,-50%);top:50%;width:100%;height:100%;background:#51adf6}.range-slider[data-vertical] .range-slider__range{left:50%;transform:translate(-50%,0)}.range-slider input[type=range]{-webkit-appearance:none;pointer-events:none;position:absolute;z-index:2;top:0;left:0;width:0;height:0;background-color:transparent}.range-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none}.range-slider input[type=range]::-moz-range-thumb{width:0;height:0;border:0}.range-slider input[type=range]:focus{outline:0}";let g=document.head,h=document.querySelector("head>style,head>link");h?g.insertBefore(f,h):g.appendChild(f),this.cssInjected=!0}a("rangeSlideDisabled",!1),a("thumbsDisabled",[!1,!1]),a("orientation","horizontal"),a("disabled",!1),a("onThumbDragStart",!1),a("onRangeDragStart",!1),a("onThumbDragEnd",!1),a("onRangeDragEnd",!1),a("onInput",!1),a("value",[25,75]),a("step",1),a("min",0),a("max",100),i(),j(),c.innerHTML=`<input type="range" min="${b.min}" max="${b.max}" step="${b.step}" value="${b.value[0]}" disabled><input type="range" min="${b.min}" max="${b.max}" step="${b.step}" value="${b.value[1]}" disabled><div role="slider" class="range-slider__thumb" ${q}></div><div role="slider" class="range-slider__thumb" ${r}></div><div class="range-slider__range"></div>`,c.classList.add("range-slider");let t=c.querySelector(".range-slider__range"),ak=c.querySelectorAll("input"),u=c.querySelectorAll(".range-slider__thumb");return s=b.max-b.min,k("",!0,!1),l(),n(),o(),m(),p(),e(c,"pointerdown",a=>{K(a)}),Array.from(u).forEach((a,b)=>{e(a,"pointerdown",c=>{M(c,b,a)}),e(a,"keydown",a=>{a.which>=37&&a.which<=40&&(a.preventDefault(),Q(b,a.which))})}),e(t,"pointerdown",a=>{N(a)}),e(document,"pointermove",a=>{O(a)}),e(document,"pointerup",()=>{ah&&(z(u[0],Z),z(u[1],Z),z(t,Z),ah=!1,ai?b.onThumbDragEnd&&b.onThumbDragEnd():b.onRangeDragEnd&&b.onRangeDragEnd())}),e(window,"resize",()=>{H(),D(),E()}),{min:(a=!1)=>x(!a&&0!==a,b.min,()=>{G(U,a)}),max:(a=!1)=>x(!a&&0!==a,b.max,()=>{G(V,a)}),step:(a=!1)=>x(!a,P(),()=>{ak[0].step=a,ak[1].step=a,k("",!0)}),value:(a=!1)=>x(!a,[aa.min,aa.max],()=>{k(d(a[0],a[1]),!0),l()}),orientation:(a=!1)=>x(!a,b.orientation,()=>{b.orientation=a,p(),k("",!0)}),disabled(a=!0){b.disabled=!!a,n()},thumbsDisabled(a=[!0,!0]){b.thumbsDisabled=a,j(),l(),m(),o()},rangeSlideDisabled(a=!0){b.rangeSlideDisabled=!!a},currentValueIndex:()=>ai?ai===U?0:1:-1}}},{},]},{},[1])(1)});

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    const facetForm = this.querySelector('form');
    facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    document.getElementById('main-collection-product-grid').classList.add('loading');
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;
      FacetFiltersForm.filterData.some(filterDataUrl) ?
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
        FacetFiltersForm.renderSectionFromFetch(url, event);
    });
    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGrid(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGrid(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;
    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
    document.getElementById('CollectionProductGrid').querySelectorAll('template').forEach(elm=>{
      elm.closest('form').append(elm.content.cloneNode(true));
    })
  }

  static renderProductCount(html) {
    const countEl = new DOMParser().parseFromString(html, 'text/html').getElementById('CollectionProductCount');
    if ( countEl ) {
      document.getElementById('CollectionProductCount').innerHTML = countEl.innerHTML;
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter');
      const matchesIndex = (element) => {
      if ( event && event.target.closest('.js-filter') ) {
        return element.dataset.index === event.target.closest('.js-filter').dataset.index;
      }
    }
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];
    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      if ( document.querySelector(selector) ) {
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
      }
    })

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderCounts(source, target) {
    const countElementSelectors = ['.facets__selected'];
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector);
      const sourceElement = source.querySelector(selector);
      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
      }
    });
  }


  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset.id,
      }
    ]
  }
  
  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }


  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }

  onSubmitForm(searchParams, event) {
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const sortFilterForms = document.querySelectorAll('facet-filters-form form');
    const forms = [];
    const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

    sortFilterForms.forEach((form) => {
      if (!isMobile) {
        if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
          const noJsElements = document.querySelectorAll('.no-js-list');
          noJsElements.forEach((el) => el.remove());
          forms.push(this.createSearchParams(form));
        }
      } else if (form.id === 'FacetFiltersFormMobile') {
        forms.push(this.createSearchParams(form));
      }
    });
    this.onSubmitForm(forms.join('&'), event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    FacetFiltersForm.renderPage(url);
  }

}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector('a');
    facetLink.setAttribute('role', 'button');
    facetLink.addEventListener('click', this.closeFilter.bind(this));
    facetLink.addEventListener('keyup', (event) => {
      event.preventDefault();
      if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
    });
  }
  closeFilter(event) {
    event.preventDefault();
    const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
    form.onActiveFilterClick(event);
  }
}

customElements.define('facet-remove', FacetRemove);

class PriceRange extends HTMLElement {

  constructor() {
    super();
    this.querySelectorAll('input')
      .forEach(element => {
        element.addEventListener('change', this.onRangeChange.bind(this));
        element.addEventListener('input', this.maxCheck.bind(this));
      });

    this.setMinAndMaxValues();
    
    //const usesComma = Boolean(this.getAttribute('data-uses-comma'));
    const inputMin = this.querySelector('input[name="filter.v.price.gte"]');
    const inputMax = this.querySelector('input[name="filter.v.price.lte"]');
    let inputTimer = null;

    if ( this.parentElement.querySelector('[data-js-price-range-slider]') ) {
      rangeSlider(this.parentElement.querySelector('[data-js-price-range-slider]'), {
        min: Number(inputMin.getAttribute('min')),
        max: Number(inputMax.getAttribute('max')),
        value: [inputMin.value || Number(inputMin.getAttribute('placeholder')), inputMax.value || Number(inputMax.getAttribute('placeholder'))],
        onInput: values => {
          inputMin.value = `${values[0]}`;
          inputMax.value = `${values[1]}`;
          clearTimeout(inputTimer);
          inputTimer = setTimeout(()=>{
            document.querySelector('facet-filters-form').onSubmitHandler({
              target: inputMin,
              preventDefault: ()=>{return;}
            });
            document.querySelector('facet-filters-form').onSubmitHandler({
              target: inputMax,
              preventDefault: ()=>{return;}
            });
            this.onRangeChange({
              currentTarget: inputMin
            });
            this.onRangeChange({
              currentTarget: inputMax
            });
          }, 500);
        }
      }); 
    }

  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }

  maxCheck(object) {
    let max = parseInt(object.target.max);
    let value = parseInt(object.target.value);

    if (value > max) {
      object.target.value = max
    }
  } 
}

customElements.define('price-range', PriceRange);