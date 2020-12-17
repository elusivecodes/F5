Object.assign(Canvas.prototype, {

    fillColor(color) {
        this._settings.fillStyle = color;

        return this;
    },

    font(font) {
        this._settings.font = font;

        return this;
    },

    fontSize(size) {
        this._settings.fontSize = size;

        return this;
    },

    fontWeight(weight) {
        this._settings.fontWeight = weight;

        return this;
    },

    noFill() {
        this._settings.fillStyle = null;

        return this;
    },

    noShadow() {
        this._settings.shadowColor = 'rgba(0,0,0,0)';

        return this;
    },

    noStroke() {
        this._settings.strokeStyle = null;

        return this;
    },

    shadowBlur(amount) {
        this._settings.shadowBlur = amount;

        return this;
    },

    shadowColor(color) {
        this._settings.shadowColor = color;

        return this;
    },

    shadowOffset(x, y) {
        this._settings.shadowOffsetX = x;
        this._settings.shadowOffsetY = y;

        return this;
    },

    strokeColor(color) {
        this._settings.strokeStyle = color;

        return this;
    },

    strokeWidth(width) {
        this._settings.lineWidth = width;

        return this;
    },

    text(text, x, y) {
        this._updateContext();

        if (this._settings.fillStyle) {
            this._context.fillText(text, x, y);
        }

        if (this._settings.strokeStyle) {
            this._context.strokeText(text, x, y);
        }

        return this;
    },

    textAlign(aligment) {
        this._settings.textAlign = aligment;

        return this;
    },

    _draw() {
        this._updateContext();

        if (this._settings.fillStyle) {
            this._context.fill();
        }

        if (this._settings.strokeStyle) {
            this._context.stroke();
        }

        return this;
    },

    _updateContext() {
        const font = [];

        if (this._settings.fontWeight) {
            font.push(this._settings.fontWeight);
        }

        font.push(`${this._settings.fontSize}px`);
        font.push(this._font);

        this._context.fillStyle = this._settings.fillStyle;
        this._context.font = font.join(' ');
        this._context.lineWidth = this._settings.lineWidth;
        this._context.shadowBlur = this._settings.shadowBlur;
        this._context.shadowColor = this._settings.shadowColor;
        this._context.shadowOffsetX = this._settings.shadowOffsetX;
        this._context.shadowOffsetY = this._settings.shadowOffsetY;
        this._context.strokeStyle = this._settings.strokeStyle;
        this._context.textAlign = this._settings.textAlign;
    }

});
