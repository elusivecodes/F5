Object.assign(Canvas.prototype, {

    linear(x1, y1, x2, y2) {
        return this._context.createLinearGradient(x1, y1, x2, y2);
    },

    radial(x1, y1, r1, x2, y2, r2) {
        return this._context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }

});
