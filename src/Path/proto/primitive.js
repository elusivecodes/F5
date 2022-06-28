/**
 * Path Primitive.
 */
Object.assign(Path.prototype, {

    /**
     * Add an arc.
     * @param {number} x The X position of the arc center.
     * @param {number} y The Y position of the arc center.
     * @param {number} radius The arc radius.
     * @param {number} startAngle The arc start angle.
     * @param {number} endAngle The arc end angle.
     * @returns {Path} The Path.
     */
    arc(x, y, radius, startAngle, endAngle) {
        this._path.arc(x, y, radius, startAngle, endAngle);

        this._setBounds([x - radius, x + radius], [y - radius, y + radius]);

        return this;
    },

    /**
     * Add a bezier curve.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} x2 The end X position.
     * @param {number} y2 The end Y position.
     * @returns {Path} The Path.
     */
    bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        this._path.moveTo(x1, y1);
        this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);

        this._setBounds([x1, cx1, cx2, x2], [y1, cy1, cy2, y2]);

        return this;
    },

    /**
     * Add a circle.
     * @param {number} x The X position of the circle center.
     * @param {number} y The Y position of the circle center.
     * @param {number} radius The circle radius.
     * @returns {Path} The Path.
     */
    circle(x, y, radius) {
        return this.ellipse(x, y, radius * 2, radius * 2);
    },

    /**
     * Add a curve.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @returns {Path} The Path.
     */
    curve(x1, y1, cx1, cy1, cx2, cy2, radius) {
        this._path.moveTo(x1, y1);
        this._path.arcTo(cx1, cy1, cx2, cy2, radius);

        this._setBounds([x1, cx1, cx2], [y1, cy1, cy2]);

        return this;
    },

    /**
     * Add an ellipse.
     * @param {number} x The X position of the ellipse center.
     * @param {number} y The Y position of the ellipse center.
     * @param {number} width The ellipse width.
     * @param {number} height The ellipse height.
     * @param {number} [angle=0] The ellipse angle.
     * @returns {Path} The Path.
     */
    ellipse(x, y, width, height, angle = 0) {
        const xRadius = width / 2;
        const yRadius = height / 2;

        this._path.ellipse(x, y, xRadius, yRadius, angle, 0, Math.PI * 2);

        this._setBounds([x - xRadius, x + xRadius], [y - yRadius, y + yRadius]);

        return this;
    },

    /**
     * Add a line.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} x2 The end X position.
     * @param {number} y2 The end Y position.
     * @returns {Path} The Path.
     */
    line(x1, y1, x2, y2) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);

        this._setBounds([x1, x2], [y1, y2]);

        return this;
    },

    /**
     * Add a quadratic.
     * @param {number} x1 The first X position.
     * @param {number} y1 The first Y position.
     * @param {number} x2 The second X position.
     * @param {number} y2 The second Y position.
     * @param {number} x3 The third X position.
     * @param {number} y3 The third Y position.
     * @param {number} x4 The fourth X position.
     * @param {number} y4 The fourth Y position.
     * @returns {Path} The Path.
     */
    quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.lineTo(x4, y4);
        this._path.closePath();

        this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);

        return this;
    },

    /**
     * Add a rectangle.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} width The rectangle width.
     * @param {number} height The rectangle height.
     * @returns {Path} The Path.
     */
    rect(x, y, width, height) {
        this._path.rect(x, y, width, height);

        this._setBounds([x, x + width], [y, y + height]);

        return this;
    },

    /**
     * Add a square.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} size The square size.
     * @returns {Path} The Path.
     */
    square(x, y, size) {
        return this.rect(x, y, size, size);
    },

    /**
     * Add a triangle.
     * @param {number} x1 The first X position.
     * @param {number} y1 The first Y position.
     * @param {number} x2 The second X position.
     * @param {number} y2 The second Y position.
     * @param {number} x3 The third X position.
     * @param {number} y3 The third Y position.
     * @returns {Path} The Path.
     */
    triangle(x1, y1, x2, y2, x3, y3) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.closePath();

        this._setBounds([x1, x2, x3], [y1, y2, y3]);

        return this;
    }

});
