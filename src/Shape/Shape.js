/**
 * Shape
 */
class Shape {

    /**
     * New Shape constructor.
     * @param {CanvasRenderingContext2D} context The canvas context.
     * @param {number} [x=0] The global X position.
     * @param {number} [y=0] The global Y position.
     * @param {number} [angle=0] The rotation angle.
     * @param {number} [anchorX=0] The anchor X position.
     * @param {number} [anchorY=0] The anchor Y position.
     * @returns {Shape} A new Shape object.
     */
    constructor(context, x = 0, y = 0, angle = 0, anchorX = 0, anchorY = 0) {
        this._context = context;

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.anchorX = anchorX;
        this.anchorY = anchorY;

        this.layers = [];
    }

    /**
     * Determine if the shape contains a point.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {Boolean} TRUE if the shape contains the point, otherwise FALSE.
     */
    containsPoint(x, y) {
        const anchor = Vector.create(this.x + this.anchorX, this.y + this.anchorY);

        const rotatedPoint = Vector.create(x, y)
            .sub(anchor)
            .rotate(-this.angle)
            .add(anchor);

        let pointInShape = false;

        for (const { contour, path } of this.layers) {
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

    /**
     * Add a contour to the shape.
     * @param {callback} callback The callback to generate the path.
     * @returns {Shape} The Shape.
     */
    contour(callback) {
        return this.layer(callback, true);
    }

    /**
     * Get the bounding box of the shape.
     * @returns {object} The bounding box.
     */
    getBoundingBox() {
        const bounding = {
            top: Number.POSITIVE_INFINITY,
            right: Number.NEGATIVE_INFINITY,
            bottom: Number.NEGATIVE_INFINITY,
            left: Number.POSITIVE_INFINITY
        };

        for (const layer of this.layers) {
            if (layer.contour) {
                continue;
            }

            const bounds = layer.path.getBoundingBox();
            const rotated1 = this._rotatePoint(bounds.right, bounds.top);
            const rotated2 = this._rotatePoint(bounds.right, bounds.bottom);
            const rotated3 = this._rotatePoint(bounds.left, bounds.bottom);
            const rotated4 = this._rotatePoint(bounds.left, bounds.top);

            bounding.top = Math.min(bounding.top, rotated1.y, rotated2.y, rotated3.y, rotated4.y);
            bounding.right = Math.max(bounding.right, rotated1.x, rotated2.x, rotated3.x, rotated4.x);
            bounding.bottom = Math.max(bounding.bottom, rotated1.y, rotated2.y, rotated3.y, rotated4.y);
            bounding.left = Math.min(bounding.left, rotated1.x, rotated2.x, rotated3.x, rotated4.x);
        }

        return {
            top: bounding.top + this.y,
            right: bounding.right + this.x,
            bottom: bounding.bottom + this.y,
            left: bounding.left + this.x,
            x: bounding.left + this.x,
            y: bounding.top + this.y,
            width: bounding.right - bounding.left,
            height: bounding.bottom - bounding.top
        };
    }

    /**
     * Add a layer to the shape.
     * @param {callback} callback The callback to generate the path.
     * @param {Boolean} [contour=false] Whether the path is contoured.
     * @returns {Shape} The Shape.
     */
    layer(callback, contour = false) {
        const path = new Path(this._context);
        callback(path);

        this.layers.push({
            contour,
            path
        });

        return this;
    }

    /**
     * Render the shape.
     * @param {object} options The rendering options.
     * @returns {HTMLCanvasElement} The rendered canvas.
     */
    render(options = {}) {
        const canvas = document.createElement('canvas');

        if (!this.layers.length) {
            return canvas;
        }

        let { width, height, x, y } = this.getBoundingBox();

        const lineWidth = Math.max(options.lineWidth, 0);

        if (lineWidth) {
            width += lineWidth * 2;
            height += lineWidth * 2;
            x -= lineWidth;
            y -= lineWidth;
        }

        const context = canvas.getContext('2d');

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        context.translate(this.x - x, this.y - y);
        context.translate(this.anchorX, this.anchorY);
        context.rotate(this.angle);
        context.translate(-this.anchorX, -this.anchorY);

        for (const { contour, path } of this.layers) {
            let { x: layerX, y: layerY } = path.getBoundingBox();

            let layerOptions;
            if (contour) {
                context.globalCompositeOperation = 'destination-out';
                layerOptions = {
                    ...options,
                    fillStyle: '#000'
                };
            } else {
                context.globalCompositeOperation = 'source-over';
                layerOptions = options;

                if (lineWidth) {
                    layerX -= lineWidth;
                    layerY -= lineWidth;
                }
            }

            const layerCanvas = path.render(layerOptions);

            context.drawImage(layerCanvas, layerX, layerY);
        }

        return canvas;
    }

    /**
     * Rotate a point around the anchor.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @returns {Vector} The rotated Vector.
     */
    _rotatePoint(x, y) {
        const anchor = Vector.create(this.anchorX, this.anchorY);

        return Vector.create(x, y)
            .sub(anchor)
            .rotate(this.angle)
            .add(anchor);
    }

}
