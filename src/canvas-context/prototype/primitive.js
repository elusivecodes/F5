/**
 * Draw an arc.
 * @param {number} x The X position of the arc center.
 * @param {number} y The Y position of the arc center.
 * @param {number} radius The arc radius.
 * @param {number} startAngle The arc start angle.
 * @param {number} endAngle The arc end angle.
 * @return {CanvasContext} The CanvasContext.
 */
export function arc(x, y, radius, startAngle, endAngle) {
    this.begin();

    this._context.arc(x, y, radius, startAngle, endAngle);

    return this.end();
};

/**
 * Draw a bezier curve.
 * @param {number} x1 The start X position.
 * @param {number} y1 The start Y position.
 * @param {number} cx1 The first control point X position.
 * @param {number} cy1 The first control point Y position.
 * @param {number} cx2 The second control point X position.
 * @param {number} cy2 The second control point Y position.
 * @param {number} x2 The end X position.
 * @param {number} y2 The end Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
    return this.begin()
        .vertex(x1, y1)
        .bezierVertex(cx1, cy1, cx2, cy2, x2, y2)
        .end();
};

/**
 * Draw a circle.
 * @param {number} x The X position of the circle center.
 * @param {number} y The Y position of the circle center.
 * @param {number} radius The circle radius.
 * @return {CanvasContext} The CanvasContext.
 */
export function circle(x, y, radius) {
    return this.ellipse(x, y, radius * 2, radius * 2);
};

/**
 * Draw a curve.
 * @param {number} x1 The start X position.
 * @param {number} y1 The start Y position.
 * @param {number} cx1 The first control point X position.
 * @param {number} cy1 The first control point Y position.
 * @param {number} cx2 The second control point X position.
 * @param {number} cy2 The second control point Y position.
 * @param {number} radius The arc radius.
 * @return {CanvasContext} The CanvasContext.
 */
export function curve(x1, y1, cx1, cy1, cx2, cy2, radius) {
    return this.begin()
        .vertex(x1, y1)
        .curveVertex(cx1, cy1, cx2, cy2, radius)
        .end();
};

/**
 * Draw an ellipse.
 * @param {number} x The X position of the ellipse center.
 * @param {number} y The Y position of the ellipse center.
 * @param {number} width The ellipse width.
 * @param {number} height The ellipse height.
 * @param {number} [angle=0] The ellipse angle.
 * @return {CanvasContext} The CanvasContext.
 */
export function ellipse(x, y, width, height, angle = 0) {
    this.begin();

    this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);

    return this.end();
};

/**
 * Draw a line.
 * @param {number} x1 The start X position.
 * @param {number} y1 The start Y position.
 * @param {number} x2 The end X position.
 * @param {number} y2 The end Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function line(x1, y1, x2, y2) {
    return this.begin()
        .vertex(x1, y1)
        .vertex(x2, y2)
        .end();
};

/**
 * Draw a point.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function point(x, y) {
    const { lineWidth, strokeStyle } = this._options;

    return this.push()
        .noStroke()
        .fill(strokeStyle)
        .circle(x, y, lineWidth)
        .pop();
};

/**
 * Draw a quadratic.
 * @param {number} x1 The first X position.
 * @param {number} y1 The first Y position.
 * @param {number} x2 The second X position.
 * @param {number} y2 The second Y position.
 * @param {number} x3 The third X position.
 * @param {number} y3 The third Y position.
 * @param {number} x4 The fourth X position.
 * @param {number} y4 The fourth Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    return this.begin()
        .vertex(x1, y1)
        .vertex(x2, y2)
        .vertex(x3, y3)
        .vertex(x4, y4)
        .end(true);
};

/**
 * Draw a rectangle.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @param {number} width The rectangle width.
 * @param {number} height The rectangle height.
 * @return {CanvasContext} The CanvasContext.
 */
export function rect(x, y, width, height) {
    this.begin();

    this._context.rect(x, y, width, height);

    return this.end();
};

/**
 * Draw a square.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @param {number} size The square size.
 * @return {CanvasContext} The CanvasContext.
 */
export function square(x, y, size) {
    return this.rect(x, y, size, size);
};

/**
 * Draw a triangle.
 * @param {number} x1 The first X position.
 * @param {number} y1 The first Y position.
 * @param {number} x2 The second X position.
 * @param {number} y2 The second Y position.
 * @param {number} x3 The third X position.
 * @param {number} y3 The third Y position.
 * @return {CanvasContext} The CanvasContext.
 */
export function triangle(x1, y1, x2, y2, x3, y3) {
    return this.begin()
        .vertex(x1, y1)
        .vertex(x2, y2)
        .vertex(x3, y3)
        .end(true);
};
