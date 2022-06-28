/**
 * Canvas v1.0
 * https://github.com/elusivecodes/FrostCanvas
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        Object.assign(global, factory(global));
    }

})(this, function(window) {
    'use strict';

    // {{code}}

    return {
        Canvas,
        CanvasContext,
        Path,
        Shape,
        Vector
    };
});