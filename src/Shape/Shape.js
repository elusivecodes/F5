class Shape {

    constructor(context, x = 0, y = 0, angle = 0, anchorX = 0, anchorY = 0) {
        this._context = context;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.anchorX = anchorX;
        this.anchorY = anchorY;

        this._layers = [];

        this._bounding = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY
        };
    }

    containsPoint(x, y) {
        const rotatedPoint = this._rotatePoint(x, y);

        let pointInShape = false;

        for (const { contour, path } of this._layers) {
            if (
                (pointInShape && !contour) ||
                (!pointInShape && contour) ||
                !path.containsPoint(rotatedPoint.x - this.x, rotatedPoint.y - this.y)
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

    getRenderBox() {
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

    layer(callback, contour = false) {
        const path = new Path(this._context);

        callback(path);

        return this._addLayer(path, contour);
    }

    render(options) {
        const bounds = this.getRenderBox();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        // document.body.append(canvas);

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

    _rotatePoint(x, y, dir = -1) {
        const anchor = Vector.create(this.x + this.anchorX, this.y + this.anchorY);
        const point = Vector.create(x, y).sub(anchor).rotate(this.angle * dir).add(anchor);

        return { x: point.x, y: point.y };
    }

}
