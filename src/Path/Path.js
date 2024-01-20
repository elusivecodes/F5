/**
 * Path
 */
export default class Path {
    /**
     * New Path constructor.
     * @param {CanvasRenderingContext2D} context The canvas context.
     */
    constructor(context) {
        this._context = context;

        this._path = new Path2D();
        this._hasVertex = false;

        this._bounding = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY,
        };
    }

    /**
     * Determine if the path contains a point.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {Boolean} TRUE if the path contains the point, otherwise FALSE.
     */
    containsPoint(x, y) {
        return this._context.isPointInPath(this._path, x, y);
    }

    /**
     * Get the bounding box of the path.
     * @return {object} The bounding box.
     */
    getBoundingBox() {
        return {
            top: this._bounding.top,
            right: this._bounding.right,
            bottom: this._bounding.bottom,
            left: this._bounding.left,
            x: this._bounding.left,
            y: this._bounding.top,
            width: this._bounding.right - this._bounding.left,
            height: this._bounding.bottom - this._bounding.top,
        };
    }

    /**
     * Render the path.
     * @param {object} options The rendering options.
     * @return {HTMLCanvasElement} The rendered canvas.
     */
    render(options = {}) {
        let { width, height, x, y } = this.getBoundingBox();

        const lineWidth = Math.max(options.lineWidth, 0);

        if (lineWidth) {
            width += lineWidth * 2;
            height += lineWidth * 2;
            x -= lineWidth;
            y -= lineWidth;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        Object.assign(context, options);

        context.translate(-x, -y);

        if (options.fillStyle) {
            context.fill(this._path);
        }

        if (options.strokeStyle) {
            context.stroke(this._path);
        }

        return canvas;
    }

    /**
     * Set the path bounds.
     * @param {Array} xs The X co-ordinates.
     * @param {Array} ys The Y co-ordinates.
     */
    _setBounds(xs, ys) {
        this._bounding.top = Math.min(this._bounding.top, ...ys);
        this._bounding.right = Math.max(this._bounding.right, ...xs);
        this._bounding.bottom = Math.max(this._bounding.bottom, ...ys);
        this._bounding.left = Math.min(this._bounding.left, ...xs);
    }
}
