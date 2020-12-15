/**
 * F5 v1.0
 * https://github.com/elusivecodes/FrostUI
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        Object.assign(global, factory());
    }

})(window, function() {
    'use strict';

    // {{code}}
    F5.Canvas = Canvas;
    F5.Input = Input;
    F5.Path = Path;
    F5.Vector = Vector;

    return {
        F5
    };
});