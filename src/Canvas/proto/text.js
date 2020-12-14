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

        if (this._fontWeight) {
            font.push(this._fontWeight);
        }

        if (this._fontSize) {
            font.push(`${this._fontSize}px`);
        }

        font.push(this._font);

        this._context.font = font.join(' ');

        if (this._fill) {
            this._context.fillText(text, x, y);
        }

        if (this._stroke) {
            this._context.strokeText(text, x, y);
        }
    },

    textAlign(aligment) {
        this._context.textAlign = aligment;
    }

});
