Object.assign(Canvas.prototype, {

    arc(x, y, r, a, b, m) {
        this._context.arc(x, y, r, a, b, m);
    },

    arcTo(x1, y1, x2, y2, r) {
        this._context.arcTo(x1, y1, x2, y2, r);
    },

    begin() {
        this._context.beginPath();
    },

    bezier(x1, y1, x2, y2, x3, y3) {
        this._context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    },

    close() {
        this._context.closePath();
    },

    end() {
        if (this._fill) {
            this._context.fill();
        }

        if (this._stroke) {
            this._context.stroke();
        }
    },

    line(x, y) {
        this._context.lineTo(x, y);
    },

    move(x, y) {
        this._context.moveTo(x, y);
    },

    quadratic(x1, y1, x2, y2) {
        this._context.quadraticCurveTo(x1, y1, x2, y2);
    }

});
