Object.assign(Canvas.prototype, {

    fillColor(color) {
        this._settings.fill = true;
        this._context.fillStyle = color;
    },

    noFill() {
        this._settings.fill = false;
        this._context.fillStyle = '#000';
    },

    noShadow() {
        this._settings.shadow = false;
        this._context.shadowColor = 'rgba(0,0,0,0)';
    },

    noStroke() {
        this._settings.shadow = false;
        this._context.strokeStyle = '#000';
    },

    shadowBlur(amount) {
        this._context.shadowBlur = amount;
    },

    shadowColor(color) {
        this._settings.shadow = true;
        this._context.shadowColor = color;
    },

    shadowOffset(x, y) {
        this._context.shadowOffsetX = x;
        this._context.shadowOffsetY = y;
    },

    strokeColor(color) {
        this._settings.shadow = true;
        this._context.strokeStyle = color;
    },

    strokeWidth(width) {
        this._context.lineWidth = width;
    }

});
