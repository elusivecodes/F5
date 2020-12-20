class Path {

    constructor(context) {
        this._context = context;

        this._path = new Path2D();
        this._hasVertex = false;

        this._bounding = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY
        };
    }

    containsPoint(x, y) {
        return this._context.isPointInPath(this._path, x, y);
    }

    getBoundingBox() {
        return {
            top: this._bounding.top,
            right: this._bounding.right,
            bottom: this._bounding.bottom,
            left: this._bounding.left,
            x: this._bounding.left,
            y: this._bounding.top,
            width: this._bounding.right - this._bounding.left,
            height: this._bounding.bottom - this._bounding.top
        };
    }

    render(options) {
        const bounds = this.getBoundingBox();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.setAttribute('width', bounds.width);
        canvas.setAttribute('height', bounds.height);

        Object.assign(context, options);

        context.translate(-bounds.x, -bounds.y);
        context.fill(this._path);

        return { canvas, context };
    }

    _setBounds(xs, ys) {
        this._bounding.top = Math.min(this._bounding.top, ...ys);
        this._bounding.right = Math.max(this._bounding.right, ...xs);
        this._bounding.bottom = Math.max(this._bounding.bottom, ...ys);
        this._bounding.left = Math.min(this._bounding.left, ...xs);

        return this;
    }

}
