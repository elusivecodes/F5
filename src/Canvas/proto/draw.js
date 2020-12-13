Object.assign(Canvas.prototype, {

    fillColor(color) {
        this._fill = true;
        this._context.fillStyle = color;
    },

    noFill() {
        this._fill = false;
    },

    noShadow() {
        this._shadow = false;
    },

    noStroke() {
        this._stroke = false;
    },

    rotate(angle) {
        this._context.rotate(angle);
    },

    scale(width, height) {
        this._context.scale(width, height);
    },

    shadowBlur(amount) {
        this._context.shadowBlur = amount;
    },

    shadowColor(color) {
        this._shadow = true;
        this._context.shadowColor = color;
    },

    shadowOffset(x, y) {
        this._context.shadowOffsetX = x;
        this._context.shadowOffsetY = y;
    },

    strokeColor(color) {
        this._stroke = true;
        this._context.strokeStyle = color;
    },

    strokeWidth(width) {
        this._context.lineWidth = width;
    },

    translate(x, y) {
        this._context.translate(x, y);
    }

});
