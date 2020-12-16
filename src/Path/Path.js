class Path {

    constructor(context, x = 0, y = 0) {
        this._context = context;
        this.x = x;
        this.y = y;

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
            top: this._bounding.top + this.y,
            right: this._bounding.right + this.x,
            bottom: this._bounding.bottom + this.y,
            left: this._bounding.left + this.x,
            x: this._bounding.left + this.x,
            y: this._bounding.top + this.y,
            width: this._bounding.right - this._bounding.left,
            height: this._bounding.bottom - this._bounding.top
        };
    }

    render(options) {
        const boundingBox = this.getBoundingBox();

        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', boundingBox.width);
        canvas.setAttribute('height', boundingBox.height);

        const context = canvas.getContext('2d');
        Object.assign(context, options);

        context.translate(-boundingBox.x, -boundingBox.y);
        context.fill(this._path);

        return { canvas, context };
    }

    _setBounds(xs, ys) {
        this._bounding.top = Math.min(this._bounding.top, ...ys);
        this._bounding.right = Math.max(this._bounding.right, ...xs);
        this._bounding.bottom = Math.max(this._bounding.bottom, ...ys);
        this._bounding.left = Math.min(this._bounding.left, ...xs);
    }

}
