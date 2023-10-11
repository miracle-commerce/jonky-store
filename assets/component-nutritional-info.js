if ( typeof NutritionalInfo !== 'function' ) {

  class NutritionalInfo extends HTMLElement {
    constructor() {
      super();
      let contentDOM = ``;
      let content = this.innerHTML;
      let titleFlag = false;
      content = content.replace(/<\/p>|<\/div>/g, '');
      content = content.split('<p>');
      for ( let i = 1; i < content.length; i++ ) {
        let contentArray = content[i].split(/<br>|<br\/>|\n/g);

        contentDOM += `<div class="table">`

        if ( this.dataset.titleLabelLeft != '' || this.dataset.titleLabelRight != '' ) {
          if ( !titleFlag ) {
            titleFlag = true;
            contentDOM += `<span class="table-line table-line--heading">`;
            if ( this.dataset.titleLabelLeft != '' ) {
              contentDOM += `<span>${this.dataset.titleLabelLeft}</span>`;
            }
            if ( this.dataset.titleLabelRight != '' ) {
              contentDOM += `<span>${this.dataset.titleLabelRight}</span>`;
            }
            contentDOM += `</span>`;
          }
        }

        for ( let j = 0; j < contentArray.length; j++ ) {
          if (contentArray[j].length > 0 && contentArray[j].replace(/\s/g, '').length != 0 ) {
            let contentBlockArrayPrepare = contentArray[j].replace(',', '#SD*@N!SA')
            let contentBlockArray = contentBlockArrayPrepare.split('#SD*@N!SA');
            contentDOM += `<span class="table-line ${(contentArray[j].includes('-') ? 'table-line--indent' : '')}">`;
            for ( let k = 0; k < contentBlockArray.length; k++ ) {
              if ( contentBlockArray[k].length > 0 && contentBlockArray[k].replace(/\s/g, '').length != 0 ) {
                contentDOM += `<span>${contentBlockArray[k].replace('-', '')}</span>`
              }
            }
            contentDOM += `</span>`;
          }
        }

        contentDOM += `</div>`;

      }
      
      this.innerHTML = contentDOM;

    }
  }

  if ( typeof customElements.get('nutritional-info') == 'undefined' ) {
    customElements.define('nutritional-info', NutritionalInfo);
	}

}
