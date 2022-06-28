/**
 * CanvasContext Path
 */
Object.assign(CanvasContext.prototype, {

    /**
     * Begin a path.
     * @returns {CanvasContext} The CanvasContext.
     */
    begin() {
        this._context.beginPath();
        this._hasVertex = false;

        return this;
    },

    /**
     * Add a bezier vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {CanvasContext} The CanvasContext.
     */
    bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

        return this;
    },

    /**
     * Add a curve vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @returns {CanvasContext} The CanvasContext.
     */
    curveVertex(cx1, cy1, cx2, cy2, radius) {
        this._context.arcTo(cx1, cy1, cx2, cy2, radius);

        return this;
    },

    /**
     * End and draw the path.
     * @param {Boolean} [close=false] Whether to close the path.
     * @returns {CanvasContext} The CanvasContext.
     */
    end(close = false) {
        if (close) {
            this._context.closePath();
        }

        this._draw();

        return this;
    },

    /**
     * Add a quadtraic vertex.
     * @param {number} cx The control point X position.
     * @param {number} cy The control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {CanvasContext} The CanvasContext.
     */
    quadraticVertex(cx, cy, x, y) {
        this._context.quadraticCurveTo(cx, cy, x, y);

        return this;
    },

    /**
     * Add a vertex.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {CanvasContext} The CanvasContext.
     */
    vertex(x, y) {
        if (!this._hasVertex) {
            this._context.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._context.lineTo(x, y);
        }

        return this;
    }

});
