Object.assign(Canvas.prototype, {

    font(font) {
        this._font = font;
    },

    fontSize(size) {
        this._fontSize = size;
    },

    fontWeight(weight) {
        this._fontWeight = weight;
    },

    text(text, x, y) {
        let font = [];

        if (this._settings.fontWeight) {
            font.push(this._settings.fontWeight);
        }

        if (this._settings.fontSize) {
            font.push(`${this._settings.fontSize}px`);
        }

        font.push(this._font);

        this._context.font = font.join(' ');

        if (this._settings.fill) {
            this._context.fillText(text, x, y);
        }

        if (this._settings.stroke) {
            this._context.strokeText(text, x, y);
        }
    },

    textAlign(aligment) {
        this._context.textAlign = aligment;
    }

});
