/**
 * Add a bezier vertex.
 * @param {number} cx1 The first control point X position.
 * @param {number} cy1 The first control point Y position.
 * @param {number} cx2 The second control point X position.
 * @param {number} cy2 The second control point Y position.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @return {Path} The Path.
 */
export function bezierVertex(cx1, cy1, cx2, cy2, x, y) {
    this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

    this._setBounds([cx1, cx2, x], [cy1, cy2, y]);

    return this;
};

/**
 * Close the path.
 * @return {Path} The Path.
 */
export function close() {
    this._path.closePath();

    return this;
};

/**
 * Add a curve vertex.
 * @param {number} cx1 The first control point X position.
 * @param {number} cy1 The first control point Y position.
 * @param {number} cx2 The second control point X position.
 * @param {number} cy2 The second control point Y position.
 * @param {number} radius The arc radius.
 * @return {Path} The Path.
 */
export function curveVertex(cx1, cy1, cx2, cy2, radius) {
    this._path.arcTo(cx1, cy1, cx2, cy2, radius);

    this._setBounds([cx1, cx2], [cy1, cy2]);

    return this;
};

/**
 * Add a quadtraic vertex.
 * @param {number} cx The control point X position.
 * @param {number} cy The control point Y position.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @return {Path} The Path.
 */
export function quadraticVertex(cx, cy, x, y) {
    this._path.quadraticCurveTo(cx, cy, x, y);

    this._setBounds([cx, x], [cy, y]);

    return this;
};

/**
 * Add a vertex.
 * @param {number} x The X position.
 * @param {number} y The Y position.
 * @return {Path} The Path.
 */
export function vertex(x, y) {
    if (!this._hasVertex) {
        this._path.moveTo(x, y);
        this._hasVertex = true;
    } else {
        this._path.lineTo(x, y);
    }

    this._setBounds([x], [y]); ;

    return this;
};
