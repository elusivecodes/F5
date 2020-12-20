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

    contains(shape) {
        if (!this.intersectsBounds(shape)) {
            return false;
        }

        const bounds = this.getRenderBox();
        const otherBounds = shape.getRenderBox();

        const { canvas } = this.render();
        const { context } = shape.render();

        context.globalCompositeOperation = 'destination-out';

        const offsetX1 = this.x + this.anchorX;
        const offsetY1 = this.y + this.anchorY;
        context.translate(offsetX1 - bounds.x, offsetY1 - bounds.y);
        context.rotate(-this.angle);
        context.translate(-offsetX1, -offsetY1);

        const offsetX2 = shape.x + shape.anchorX;
        const offsetY2 = shape.y + shape.anchorY;
        context.translate(offsetX2, offsetY2);
        context.rotate(shape.angle);
        context.translate(-offsetX2, -offsetY2);

        context.drawImage(canvas, otherBounds.x, otherBounds.y);

        return this.constructor._isContextBlank(context, otherBounds.width, otherBounds.height);
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

    getBoundingBox() {
        const bounds = this.getBoundingPoints();

        const top = Math.min(bounds[1], bounds[3], bounds[5], bounds[7]);
        const right = Math.max(bounds[0], bounds[2], bounds[4], bounds[6])
        const bottom = Math.max(bounds[1], bounds[3], bounds[5], bounds[7]);
        const left = Math.min(bounds[0], bounds[2], bounds[4], bounds[6])

        return {
            top,
            right,
            bottom,
            left,
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }

    getBoundingPoints() {
        const bounds = this.getRenderBox();

        const p1 = this._rotatePoint(bounds.left, bounds.top, 1);
        const p2 = this._rotatePoint(bounds.right, bounds.top, 1);
        const p3 = this._rotatePoint(bounds.right, bounds.bottom, 1);
        const p4 = this._rotatePoint(bounds.left, bounds.bottom, 1);

        return [
            p1.x,
            p1.y,
            p2.x,
            p2.y,
            p3.x,
            p3.y,
            p4.x,
            p4.y
        ];
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

    intersects(shape) {
        if (!this.intersectsBounds(shape)) {
            return false;
        }

        const bounds = this.getRenderBox();
        const otherBounds = shape.getRenderBox();

        const { context } = this.render();
        const { canvas } = shape.render();

        context.globalCompositeOperation = 'destination-in';

        const offsetX1 = this.x + this.anchorX;
        const offsetY1 = this.y + this.anchorY;
        context.translate(offsetX1 - bounds.x, offsetY1 - bounds.y);
        context.rotate(-this.angle);
        context.translate(-offsetX1, -offsetY1);

        const offsetX2 = shape.x + shape.anchorX;
        const offsetY2 = shape.y + shape.anchorY;
        context.translate(offsetX2, offsetY2);
        context.rotate(shape.angle);
        context.translate(-offsetX2, -offsetY2);

        context.drawImage(canvas, otherBounds.x, otherBounds.y);

        return !this.constructor._isContextBlank(context, bounds.width, bounds.height);
    }

    intersectsBounds(shape) {
        const bounds = this.getBoundingBox();
        const otherBounds = shape.getBoundingBox();

        return !(bounds.bottom < otherBounds.top || bounds.left > otherBounds.right || bounds.top > otherBounds.bottom || bounds.right < otherBounds.left);
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

    _boundsOverlap(shape) {
        const bounds = this.getBoundingPoints();
        const p1 = shape._rotatePoint(bounds[0], bounds[1]);
        const p2 = shape._rotatePoint(bounds[2], bounds[3]);
        const p3 = shape._rotatePoint(bounds[4], bounds[5]);
        const p4 = shape._rotatePoint(bounds[6], bounds[7]);

        const top = Math.min(p1.y, p2.y, p3.y, p4.y);
        const right = Math.max(p1.x, p2.x, p3.x, p4.x);
        const bottom = Math.max(p1.y, p2.y, p3.y, p4.y);
        const left = Math.min(p1.x, p2.x, p3.x, p4.x);

        const otherBounds = shape.getRenderBox();

        return !(bottom < otherBounds.top || left > otherBounds.right || top > otherBounds.bottom || right < otherBounds.left);
    }

    _rotatePoint(x, y, dir = -1) {
        const anchor = Vector.create(this.x + this.anchorX, this.y + this.anchorY);
        const point = Vector.create(x, y).sub(anchor).rotate(this.angle * dir).add(anchor);

        return { x: point.x, y: point.y };
    }

    static _isContextBlank(context, width, height) {
        const data = context.getImageData(0, 0, width, height);
        const buffer = new Uint32Array(data.data.buffer);

        return buffer.every(value => !value);
    }

}
