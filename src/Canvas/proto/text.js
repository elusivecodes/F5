Object.assign(Canvas.prototype, {

    align(aligment) {
        this._fontAlign = aligment;
    },

    fontSize(size) {
        this._fontSize = size;
    },

    font(font) {
        this._font = font;
    },

    fill(text, x, y) {
        this._context.font = this._fontSize + 'px ' + this._font;
        this._context.fillText(text, x, y);
    },

    stroke(text, x, y) {
        this._context.font = this._fontSize + 'px ' + this._font;
        this._context.strokeText(text, x, y);
    }

});
