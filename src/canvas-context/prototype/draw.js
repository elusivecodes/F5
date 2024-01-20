/**
 * Set the fill color/style.
 * @param {string|CanvasGradient} color The color/gradient.
 * @return {CanvasContext} The CanvasContext.
 */
export function fill(color) {
    this._options.fillStyle = color;

    return this;
};

/**
 * Set the font family.
 * @param {string} font The font family.
 * @return {CanvasContext} The CanvasContext.
 */
export function font(font) {
    this._options.font = font;

    return this;
};

/**
 * Set the font size.
 * @param {number} size The font size.
 * @return {CanvasContext} The CanvasContext.
 */
export function fontSize(size) {
    this._options.fontSize = size;

    return this;
};

/**
 * Set the font weight.
 * @param {string|number} weight The font weight.
 * @return {CanvasContext} The CanvasContext.
 */
export function fontWeight(weight) {
    this._options.fontWeight = weight;

    return this;
};

/**
 * Remove the fill color/style.
 * @return {CanvasContext} The CanvasContext.
 */
export function noFill() {
    this._options.fillStyle = null;

    return this;
};

/**
 * Remove the shadow.
 * @return {CanvasContext} The CanvasContext.
 */
export function noShadow() {
    this._options.shadowColor = 'rgba(0,0,0,0)';

    return this;
};

/**
 * Remove the stroke.
 * @return {CanvasContext} The CanvasContext.
 */
export function noStroke() {
    this._options.strokeStyle = null;

    return this;
};

/**
 * Set the shadow color.
 * @param {string|CanvasGradient} color The color.
 * @return {CanvasContext} The CanvasContext.
 */
export function shadow(color) {
    this._options.shadowColor = color;

    return this;
};

/**
 * Set the shadow blur amount.
 * @param {number} amount The blur amount.
 * @return {CanvasContext} The CanvasContext.
 */
export function shadowBlur(amount) {
    this._options.shadowBlur = amount;

    return this;
};

/**
 * Set the shadow x/y offset.
 * @param {number} [x=0] The X offset.
 * @param {number} [y=0] The Y offset.
 * @return {CanvasContext} The CanvasContext.
 */
export function shadowOffset(x = 0, y = 0) {
    this._options.shadowOffsetX = x;
    this._options.shadowOffsetY = y;

    return this;
};

/**
 * Set the stroke color/style.
 * @param {string|CanvasGradient} color The color/gradient.
 * @return {CanvasContext} The CanvasContext.
 */
export function stroke(color) {
    this._options.strokeStyle = color;

    return this;
};

/**
 * Set the stroke width.
 * @param {number} width The width.
 * @return {CanvasContext} The CanvasContext.
 */
export function strokeWidth(width) {
    this._options.lineWidth = width;

    return this;
};

/**
 * Draw text to the canvas.
 * @param {string} text The text to draw.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function text(text, x, y) {
    this._updateContext();

    const font = [];

    if (this._options.fontWeight) {
        font.push(this._options.fontWeight);
    }

    font.push(`${this._options.fontSize}px`);
    font.push(this._options.font);

    this._context.font = font.join(' ');
    this._context.textAlign = this._options.textAlign;

    if (this._options.fillStyle) {
        this._context.fillText(text, x, y);
    }

    if (this._options.strokeStyle) {
        this._context.strokeText(text, x, y);
    }

    return this;
};

/**
 * Set the text alignment.
 * @param {string} aligment The text alignment.
 * @return {CanvasContext} The CanvasContext.
 */
export function textAlign(aligment) {
    this._options.textAlign = aligment;

    return this;
};

/**
 * Draw to the canvas.
 */
export function _draw() {
    this._updateContext();

    if (this._options.fillStyle) {
        this._context.fill();
    }

    if (this._options.strokeStyle) {
        this._context.stroke();
    }
};

/**
 * Update the canvas context.
 */
export function _updateContext() {
    this._context.fillStyle = this._options.fillStyle;
    this._context.lineWidth = this._options.lineWidth;
    this._context.shadowBlur = this._options.shadowBlur;
    this._context.shadowColor = this._options.shadowColor;
    this._context.shadowOffsetX = this._options.shadowOffsetX;
    this._context.shadowOffsetY = this._options.shadowOffsetY;
    this._context.strokeStyle = this._options.strokeStyle;
}
