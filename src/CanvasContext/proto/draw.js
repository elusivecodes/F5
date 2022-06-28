/**
 * CanvasContext Draw
 */
Object.assign(CanvasContext.prototype, {

    /**
     * Set the fill color/style.
     * @param {string|CanvasGradient} color The color/gradient.
     * @returns {CanvasContext} The CanvasContext.
     */
    fill(color) {
        this._settings.fillStyle = color;

        return this;
    },

    /**
     * Set the font family.
     * @param {string} font The font family.
     * @returns {CanvasContext} The CanvasContext.
     */
    font(font) {
        this._settings.font = font;

        return this;
    },

    /**
     * Set the font size.
     * @param {number} size The font size.
     * @returns {CanvasContext} The CanvasContext.
     */
    fontSize(size) {
        this._settings.fontSize = size;

        return this;
    },

    /**
     * Set the font weight.
     * @param {string|number} weight The font weight.
     * @returns {CanvasContext} The CanvasContext.
     */
    fontWeight(weight) {
        this._settings.fontWeight = weight;

        return this;
    },

    /**
     * Remove the fill color/style.
     * @returns {CanvasContext} The CanvasContext.
     */
    noFill() {
        this._settings.fillStyle = null;

        return this;
    },

    /**
     * Remove the shadow.
     * @returns {CanvasContext} The CanvasContext.
     */
    noShadow() {
        this._settings.shadowColor = 'rgba(0,0,0,0)';

        return this;
    },

    /**
     * Remove the stroke.
     * @returns {CanvasContext} The CanvasContext.
     */
    noStroke() {
        this._settings.strokeStyle = null;

        return this;
    },

    /**
     * Set the shadow color.
     * @param {string|CanvasGradient} color The color.
     * @returns {CanvasContext} The CanvasContext.
     */
    shadow(color) {
        this._settings.shadowColor = color;

        return this;
    },

    /**
     * Set the shadow blur amount.
     * @param {number} amount The blur amount.
     * @returns {CanvasContext} The CanvasContext.
     */
    shadowBlur(amount) {
        this._settings.shadowBlur = amount;

        return this;
    },

    /**
     * Set the shadow x/y offset.
     * @param {number} [x=0] The X offset.
     * @param {number} [y=0] The Y offset.
     * @returns {CanvasContext} The CanvasContext.
     */
    shadowOffset(x = 0, y = 0) {
        this._settings.shadowOffsetX = x;
        this._settings.shadowOffsetY = y;

        return this;
    },

    /**
     * Set the stroke color/style.
     * @param {string|CanvasGradient} color The color/gradient.
     * @returns {CanvasContext} The CanvasContext.
     */
    stroke(color) {
        this._settings.strokeStyle = color;

        return this;
    },

    /**
     * Set the stroke width.
     * @param {number} width The width.
     * @returns {CanvasContext} The CanvasContext.
     */
    strokeWidth(width) {
        this._settings.lineWidth = width;

        return this;
    },

    /**
     * Draw text to the canvas.
     * @param {string} text The text to draw.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {CanvasContext} The CanvasContext.
     */
    text(text, x, y) {
        this._updateContext();

        const font = [];

        if (this._settings.fontWeight) {
            font.push(this._settings.fontWeight);
        }

        font.push(`${this._settings.fontSize}px`);
        font.push(this._settings.font);

        this._context.font = font.join(' ');
        this._context.textAlign = this._settings.textAlign;

        if (this._settings.fillStyle) {
            this._context.fillText(text, x, y);
        }

        if (this._settings.strokeStyle) {
            this._context.strokeText(text, x, y);
        }

        return this;
    },

    /**
     * Set the text alignment.
     * @param {string} aligment The text alignment.
     * @returns {CanvasContext} The CanvasContext.
     */
    textAlign(aligment) {
        this._settings.textAlign = aligment;

        return this;
    },

    /**
     * Draw to the canvas.
     */
    _draw() {
        this._updateContext();

        if (this._settings.fillStyle) {
            this._context.fill();
        }

        if (this._settings.strokeStyle) {
            this._context.stroke();
        }
    },

    /**
     * Update the canvas context.
     */
    _updateContext() {
        this._context.fillStyle = this._settings.fillStyle;
        this._context.lineWidth = this._settings.lineWidth;
        this._context.shadowBlur = this._settings.shadowBlur;
        this._context.shadowColor = this._settings.shadowColor;
        this._context.shadowOffsetX = this._settings.shadowOffsetX;
        this._context.shadowOffsetY = this._settings.shadowOffsetY;
        this._context.strokeStyle = this._settings.strokeStyle;
    }

});
