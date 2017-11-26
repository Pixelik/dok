/* global jQuery */
import computeSelectors from '../../core/helpers/compute-selectors';
import OpenClose from '../../core/classes/open-close';
import jquerify from '../../core/utils/jquerify';

export default (($) => {
  // Constants
  const NAME = 'alert';
  const DATA_KEY = `pdui.${NAME}`;
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';

  const CLASSNAMES = {
    ALERT: 'alert',
    ALERT_HIDDEN: `alert--hidden`,
    ALERT_CLOSE: `alert__close-button`
  };

  const ATTRIBUTES = {
    'autoclose': false,
    'autoclose-delay': 5
  };

  const SELECTORS = computeSelectors(CLASSNAMES, ATTRIBUTES);

  const EVENTS = {
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  };

  // Class Definition
  class Alert extends OpenClose {
    constructor(element, options) {
      super(
        element,
        DATA_KEY,
        ATTRIBUTES,
        options
      );
    }

    // Public
    isOpened() {
      return !this.$elt.hasClass(CLASSNAMES.ALERT_HIDDEN);
    }

    _init(options) {
      this._enableAutoclose(options);
      return super._init(options);
    }

    _enableAutoclose(options = {}) {
      if (options.isAutoclose || this._attributes.autoclose !== false) {
        const delay = options.delay || this._attributes['autoclose-delay'];
        this._timeoutID = setTimeout(()=> this.remove(), delay * 1000);
      }
    }

    open(options = {}) {
      this._enableAutoclose(options);
      super.open(undefined, ()=> {
        this.$elt.removeClass(CLASSNAMES.ALERT_HIDDEN);
      });
    }

    close() {
      if (this._timeoutID) {
        clearTimeout(this._timeoutID);
      }
      super.close(undefined, ()=> {
        this.$elt.addClass(CLASSNAMES.ALERT_HIDDEN);
      });
    }
  }

  // Data Api implementation
  const callBlock = jquerify(Alert, NAME, SELECTORS.CLASSNAME_ALERT);
  $(document)
    .on(EVENTS.CLICK_DATA_API, SELECTORS.CLASSNAME_ALERT_CLOSE, (event)=> {
      return callBlock(event, 'remove');
    });

  return Alert;
})(jQuery);
