Object.assign(Canvas.prototype, {

    background(color) {
        this.fillColor(color);
        this.begin();
        this._context.rect(0, 0, this.width, this.height);
        this.end();
    },

    clear() {
        this._context.clearRect(0, 0, this.width, this.height);
    },

    fillColor(color) {
        this._fill = true;
        this._context.fillStyle = color;
    },

    noFill() {
        this._fill = false;
        this._context.fillStyle = '#000';
    },

    noShadow() {
        this._shadow = false;
        this._context.shadowColor = 'rgba(0,0,0,0)';
    },

    noStroke() {
        this._stroke = false;
        this._context.strokeStyle = '#000';
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
    }

});
