class Shape {

    constructor(context, x = 0, y = 0) {
        this._context = context;
        this.x = x;
        this.y = y;

        this._layers = [];

        this._bounding = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY
        };
    }

    contains(shape) {
        const bounds = this.getBoundingBox();
        const otherBounds = shape.getBoundingBox();

        // check bounding boxes overlap
        if (bounds.top > otherBounds.top || bounds.right < otherBounds.right || bounds.bottom < otherBounds.bottom || bounds.left > otherBounds.left) {
            return false;
        }

        const { canvas } = this.render();
        const { context } = shape.render();

        context.globalCompositeOperation = 'destination-out';
        context.drawImage(canvas, bounds.x - otherBounds.x, bounds.y - otherBounds.y);

        return this.constructor._isContextBlank(context, otherBounds.width, otherBounds.height);
    }

    containsPoint(x, y) {
        let pointInShape = false;

        for (const { contour, path } of this._layers) {
            if (
                (pointInShape && !contour) ||
                (!pointInShape && contour) ||
                !path.containsPoint(x, y)
            ) {
                continue;
            }

            pointInShape = !pointInShape;
        }

        return pointInShape;
    }

    contour(callback) {
        return this.layer(callback, true);
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

    intersects(shape) {
        const bounds = this.getBoundingBox();
        const otherBounds = shape.getBoundingBox();

        // check bounding boxes overlap
        if (bounds.top > otherBounds.bottom || bounds.right < otherBounds.left || bounds.bottom < otherBounds.top || bounds.left > otherBounds.right) {
            return false;
        }

        const { context } = this.render();
        const { canvas } = shape.render();

        context.globalCompositeOperation = 'destination-in';
        context.drawImage(canvas, otherBounds.x - bounds.x, otherBounds.y - bounds.y);

        return !this.constructor._isContextBlank(context, bounds.width, bounds.height);
    }

    layer(callback, contour = false) {
        const path = new Path(this._context);

        callback(path);

        return this._addLayer(path, contour);
    }

    render(options) {
        const bounds = this.getBoundingBox();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.setAttribute('width', bounds.width);
        canvas.setAttribute('height', bounds.height);

        for (const { contour, path } of this._layers) {
            const layerBounds = path.getBoundingBox();

            let layerOptions;
            if (contour) {
                context.globalCompositeOperation = 'destination-out';
                layerOptions = {
                    fillStyle: '#000'
                };
            } else {
                context.globalCompositeOperation = 'source-over';
                layerOptions = options;
            }

            const { canvas: layerCanvas } = path.render(layerOptions);

            context.drawImage(layerCanvas, this.x + layerBounds.x - bounds.x, this.y + layerBounds.y - bounds.y);
        }

        return { canvas, context };
    }

    _addLayer(path, contour = false) {
        this._layers.push({
            contour,
            path
        });

        if (!contour) {
            const bounds = path.getBoundingBox();
            this._bounding.top = Math.min(this._bounding.top, bounds.top);
            this._bounding.right = Math.max(this._bounding.right, bounds.right);
            this._bounding.bottom = Math.max(this._bounding.bottom, bounds.bottom);
            this._bounding.left = Math.min(this._bounding.left, bounds.left);
        }

        return this;
    }

    static _isContextBlank(context, width, height) {
        const data = context.getImageData(0, 0, width, height);
        const buffer = new Uint32Array(data.data.buffer);

        return buffer.every(value => !value);
    }

}
