import Path from './../path/path.js';
import Shape from './../shape/shape.js';

/**
 * CanvasContext
 */
export default class CanvasContext {
    /**
     * New CanvasContext constructor.
     * @param {HTMLCanvasElement} node The canvas node.
     * @param {number} [width=600] The canvas width.
     * @param {number} [height=400] The canvas height.
     * @param {object} [options] The canvas options.
     */
    constructor(node, width = 600, height = 400, options = {}) {
        this._node = node;
        this._context = this._node.getContext('2d');

        this._options = {
            ...this.constructor.defaults,
            options,
        };

        this._states = [];
        this._hasVertex = false;

        this.resize(width, height);
    }

    /**
     * Apply a matrix transform.
     * @param {number} a The horizontal scaling amount.
     * @param {number} b The vertical skewing.
     * @param {number} c The horizontal skewing.
     * @param {number} d The vertical scaling amount.
     * @param {number} e The horizontal translation.
     * @param {number} f The vertical translation.
     * @return {CanvasContext} The CanvasContext.
     */
    applyMatrix(a, b, c, d, e, f) {
        this._context.transform(a, b, c, d, e, f);

        return this;
    }

    /**
     * Fill the entire canvas with a color.
     * @param {string|CanvasGradient} color The color/gradient.
     * @return {CanvasContext} The CanvasContext.
     */
    background(color) {
        return this.push()
            .noStroke()
            .fill(color)
            .rect(0, 0, this.width, this.height)
            .pop();
    }

    /**
     * Clear the entire canvas.
     * @return {CanvasContext} The CanvasContext.
     */
    clear() {
        this._context.clearRect(0, 0, this.width, this.height);

        return this;
    }

    /**
     * Create a new Shape.
     * @param {number} [x=0] The global X position.
     * @param {number} [y=0] The global Y position.
     * @param {number} [angle=0] The rotation angle.
     * @param {number} [anchorX=0] The anchor X position.
     * @param {number} [anchorY=0] The anchor Y position.
     * @return {Shape} The Shape.
     */
    createShape(x = 0, y = 0, angle = 0, anchorX = 0, anchorY = 0) {
        return new Shape(this._context, x, y, angle, anchorX, anchorY);
    }

    /**
     * Create a new Path.
     * @return {Path} The Path.
     */
    createPath() {
        return new Path(this._context);
    }

    /**
     * Draw an image on the canvas.
     * @param {HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap|OffscreenCanvas|VideoFrame} image The image.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    drawImage(image, x = 0, y = 0) {
        this._context.drawImage(image, x, y);

        return this;
    }

    /**
     * Draw a Path on the canvas.
     * @param {Path} path The Path.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    drawPath(path, x = 0, y = 0) {
        const bounds = path.getBoundingBox();
        const canvas = path.render(this._options);

        return this.drawImage(canvas, bounds.x + x, bounds.y + y);
    }

    /**
     * Draw a Shape on the canvas.
     * @param {Shape} shape The Shape.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    drawShape(shape, x = 0, y = 0) {
        let { x: shapeX, y: shapeY } = shape.getBoundingBox();

        const lineWidth = Math.max(this._options.lineWidth, 0);

        if (lineWidth) {
            shapeX -= lineWidth;
            shapeY -= lineWidth;
        }

        const canvas = shape.render(this._options);

        return this.drawImage(canvas, shapeX + x, shapeY + y);
    }

    /**
     * Erase a path from the Canvas.
     * @param {callback} callback The callback to generate the path.
     * @return {CanvasContext} The CanvasContext.
     */
    erase(callback) {
        const path = this.createPath();
        callback(path);

        this.push();

        this._context.globalCompositeOperation = 'destination-out';

        return this
            .reset()
            .fill('#000')
            .drawPath(path)
            .pop();
    }

    /**
     * Get the canvas image data.
     * @param {number} sx The X offset.
     * @param {number} sy The Y offset.
     * @param {number} sw The width.
     * @param {number} sh The height.
     * @return {ImageData} The image data.
     */
    getImage(sx, sy, sw, sh) {
        return this._context.getImageData(sx, sy, sw, sh);
    }

    /**
     * Restore the previous canvas settings and transformation.
     * @return {CanvasContext} The CanvasContext.
     */
    pop() {
        if (this._states.length) {
            this._options = this._states.pop();
            this._context.restore();
        }

        return this;
    }

    /**
     * Save the canvas settings and transformation.
     * @return {CanvasContext} The CanvasContext.
     */
    push() {
        this._states.push({ ...this._options });
        this._context.save();

        return this;
    }

    /**
     * Put image data on the canvas.
     * @param {ImageData} image The image data.
     * @param {number} dx The X position.
     * @param {number} dy The Y  position.
     * @param {number} dirtyX The X offset.
     * @param {number} dirtyY The Y offset.
     * @param {number} dirtyWidth The width.
     * @param {number} dirtyHeight The height.
     * @return {CanvasContext} The CanvasContext.
     */
    putImage(image, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        if (arguments.length > 3) {
            this._context.putImageData(image, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
        } else {
            this._context.putImageData(image, dx, dy);
        }

        return this;
    }

    /**
     * Reset the canvas settings and transformation.
     * @return {CanvasContext} The CanvasContext.
     */
    reset() {
        this._options = this.constructor.defaults;

        return this.resetMatrix();
    }

    /**
     * Reset the canvas transformation matrix.
     * @return {CanvasContext} The CanvasContext.
     */
    resetMatrix() {
        this._context.resetTransform();

        return this;
    }

    /**
     * Resize the canvas.
     * @param {number} w The width.
     * @param {number} h The height.
     * @return {CanvasContext} The CanvasContext.
     */
    resize(w, h) {
        this.width = w;
        this.height = h;
        this._node.setAttribute('width', this.width);
        this._node.setAttribute('height', this.height);

        return this;
    }

    /**
     * Rotate the canvas.
     * @param {number} angle The rotation angle.
     * @return {CanvasContext} The CanvasContext.
     */
    rotate(angle) {
        this._context.rotate(angle);

        return this;
    }

    /**
     * Scale the canvas.
     * @param {number} x The horizontal scaling.
     * @param {number} [y] The vertical scaling.
     * @return {CanvasContext} The CanvasContext.
     */
    scale(x, y = null) {
        if (y === undefined) {
            y = x;
        }

        this._context.scale(x, y);

        return this;
    }

    /**
     * Translate the canvas origin.
     * @param {number} x The X offset.
     * @param {number} y The Y offset.
     * @return {CanvasContext} The CanvasContext.
     */
    translate(x, y) {
        this._context.translate(x, y);

        return this;
    }
}
