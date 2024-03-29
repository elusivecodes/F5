(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.F5 = {}));
})(this, (function (exports) { 'use strict';

    /**
     * Path
     */
    class Path {
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

    /**
     * Parse a Vector or X/Y co-ordinates.
     * @param {Vector|number} x A Vector, or the X position.
     * @param {number} [y] The Y position.
     * @return {Vector} The new Vector.
     */
    function parseVector(x, y) {
        if (x instanceof Vector) {
            return x;
        }

        return new Vector(x, y);
    }

    /**
     * Vector
     */
    class Vector {
        /**
         * New Vector constructor.
         * @param {number} [x=0] The X position.
         * @param {number} [y=0] The Y position.
         */
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        /**
         * Add another Vector to the Vector.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {Vector} The Vector.
         */
        add(x, y) {
            const other = parseVector(x, y);

            this.x += other.x;
            this.y += other.y;

            return this;
        }

        /**
         * Calculate the angle to another Vector.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {number} The angle to the other Vector.
         */
        angleTo(x, y) {
            const other = parseVector(x, y);

            return other.getHeading() - this.getHeading();
        };

        /**
         * Clone the Vector.
         * @return {Vector} A new Vector.
         */
        clone() {
            return new this.constructor(this.x, this.y);
        }

        /**
         * Calculate the distance to another Vector.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {number} The distance to the other Vector.
         */
        distTo(x, y) {
            const other = parseVector(x, y);

            return Math.hypot(other.x - this.x, other.y - this.y);
        }

        /**
         * Divide the Vector by another.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {Vector} The Vector.
         */
        div(x, y) {
            const other = parseVector(x, y);

            this.x /= other.x;
            this.y /= other.y;

            return this;
        }

        /**
         * Perform a dot product multiplication of the Vector with another.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {Vector} The Vector.
         */
        dot(x, y) {
            const other = parseVector(x, y);

            this.x *= other.y;
            this.y *= other.x;

            return this;
        }

        /**
         * Get the angle of the Vector.
         * @return {number} The angle.
         */
        getHeading() {
            return Math.atan2(this.y, this.x);
        }

        /**
         * Get the magnitude of the Vector.
         * @return {number} The magnitude.
         */
        getMag() {
            return Math.hypot(this.x, this.y);
        }

        /**
         * Limit the Vector magnitude.
         * @param {number} mag The magnitude.
         * @return {Vector} The Vector.
         */
        limit(mag) {
            if (this.getMag() <= mag) {
                return this;
            }

            return this.setMag(mag);
        }

        /**
         * Multiply the Vector by another.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {Vector} The Vector.
         */
        mult(x, y) {
            const other = parseVector(x, y);

            this.x *= other.x;
            this.y *= other.y;

            return this;
        }

        /**
         * Normalize the Vector magnitude.
         * @return {Vector} The Vector.
         */
        normalize() {
            return this.setMag(1);
        }

        /**
         * Rotate the Vector.
         * @param {number} angle The angle.
         * @return {Vector} The Vector.
         */
        rotate(angle) {
            angle += this.getHeading();

            const mag = this.getMag();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        /**
         * Set the angle of the Vector.
         * @param {number} angle The angle.
         * @return {Vector} The Vector.
         */
        setHeading(angle) {
            const mag = this.getMag();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        /**
         * Set the magnitude of the Vector.
         * @param {number} mag The magnitude.
         * @return {Vector} The Vector.
         */
        setMag(mag) {
            const angle = this.getHeading();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        /**
         * Subtract another Vector from the Vector.
         * @param {Vector|number} x The other Vector, or the X position.
         * @param {number} [y] The Y position.
         * @return {Vector} The Vector.
         */
        sub(x, y) {
            const other = parseVector(x, y);

            this.x -= other.x;
            this.y -= other.y;

            return this;
        }

        /**
         * Create a new Vector.
         * @param {number} [x=0] The X position.
         * @param {number} [y=0] The Y position.
         * @return {Vector} A new Vector object.
         */
        static create(x = 0, y = 0) {
            return new this(x, y);
        }

        /**
         * Create a random Vector.
         * @return {Vector} A new Vector object.
         */
        static random() {
            return new this(Math.random(), Math.random());
        }
    }

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
         * @return {Boolean} TRUE if the shape contains the point, otherwise FALSE.
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
         * @return {Shape} The Shape.
         */
        contour(callback) {
            return this.layer(callback, true);
        }

        /**
         * Get the bounding box of the shape.
         * @return {object} The bounding box.
         */
        getBoundingBox() {
            const bounding = {
                top: Number.POSITIVE_INFINITY,
                right: Number.NEGATIVE_INFINITY,
                bottom: Number.NEGATIVE_INFINITY,
                left: Number.POSITIVE_INFINITY,
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
                height: bounding.bottom - bounding.top,
            };
        }

        /**
         * Add a layer to the shape.
         * @param {callback} callback The callback to generate the path.
         * @param {Boolean} [contour=false] Whether the path is contoured.
         * @return {Shape} The Shape.
         */
        layer(callback, contour = false) {
            const path = new Path(this._context);
            callback(path);

            this.layers.push({
                contour,
                path,
            });

            return this;
        }

        /**
         * Render the shape.
         * @param {object} options The rendering options.
         * @return {HTMLCanvasElement} The rendered canvas.
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
                        fillStyle: '#000',
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
         * @return {Vector} The rotated Vector.
         */
        _rotatePoint(x, y) {
            const anchor = Vector.create(this.anchorX, this.anchorY);

            return Vector.create(x, y)
                .sub(anchor)
                .rotate(this.angle)
                .add(anchor);
        }
    }

    /**
     * CanvasContext
     */
    class CanvasContext {
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

    /**
     * Canvas
     */
    class Canvas {
        /**
         * New Canvas constructor.
         * @param {HTMLCanvasElement} node The canvas node.
         * @param {number} [width=600] The canvas width.
         * @param {number} [height=400] The canvas height.
         */
        constructor(node, width = 600, height = 400) {
            this._node = node;

            this._loop = true;
            this._mouseX = null;
            this._mouseY = null;
            this._mouseDown = {};
            this._keysDown = {};

            this.context = new CanvasContext(this._node, width, height);

            this._node.setAttribute('tabindex', '1');
            this._node.style.setProperty('outline', '0');

            this._events();
            this.setup();

            const start = Date.now();

            const run = (_) => {
                const now = Date.now();
                const delta = (now - start) / 1000;

                this.update(delta);

                if (!this._loop) {
                    return;
                }

                window.requestAnimationFrame(run);
            };

            run();
        }

        /**
         * Determine if a key is being pressed.
         * @param {string} code The key code.
         * @return {Boolean} TRUE if the key is being pressed, otherwise FALSE.
         */
        isKeyPressed(code) {
            return code ?
                code in this._keysDown :
                Object.keys(this._keysDown).length;
        }

        /**
         * Determine if a mouse button is being pressed.
         * @param {number} button The mouse button.
         * @return {Boolean} TRUE if the mouse button is being pressed, otherwise FALSE.
         */
        isMousePressed(button = 0) {
            return button in this._mouseDown && this._mouseX !== null && this._mouseY !== null;
        }

        /**
         * Get the mouse position.
         * @return {Vector|null} The mouse position.
         */
        mousePos() {
            if (this._mouseX === null || this._mouseY === null) {
                return null;
            }

            return new Vector(this._mouseX, this._mouseY);
        }

        /**
         * Stop the update method.
         */
        noLoop() {
            this._loop = false;
        }

        /**
         * Key down callback.
         */
        onKeyDown() {

        }

        /**
         * Key press callback.
         */
        onKeyPress() {

        }

        /**
         * Key up callback.
         */
        onKeyUp() {

        }

        /**
         * Mouse click callback.
         */
        onMouseClick() {

        }

        /**
         * Mouse down callback.
         */
        onMouseDown() {

        }

        /**
         * Mouse enter callback.
         */
        onMouseEnter() {

        }

        /**
         * Mouse leave callback.
         */
        onMouseLeave() {

        }

        /**
         * Mouse move callback.
         */
        onMouseMove() {

        }

        /**
         * Mouse up callback.
         */
        onMouseUp() {

        }

        /**
         * Setup callback.
         */
        setup() {

        }

        /**
         * Update callback.
         */
        update() {

        }

        /**
         * Attach events for the Canvas.
         */
        _events() {
            const updateMouse = (e) => {
                this._mouseX = e.offsetX;
                this._mouseY = e.offsetY;
            };

            this._node.addEventListener('mouseenter', (e) => {
                updateMouse(e);

                this.onMouseEnter(e);
            });

            this._node.addEventListener('mouseleave', (e) => {
                updateMouse(e);

                this.onMouseLeave(e);

                this._mouseX = null;
                this._mouseY = null;
            });

            this._node.addEventListener('mousemove', (e) => {
                updateMouse(e);

                this.onMouseMove(this._mouseX, this._mouseY, e);
            });

            this._node.addEventListener('mousedown', (e) => {
                this._mouseDown[e.button] = true;

                updateMouse(e);

                this.onMouseDown(e.button, e);

                window.addEventListener('mouseup', (e) => {
                    delete this._mouseDown[e.button];

                    updateMouse(e);

                    this.onMouseUp(e.button, e);
                }, {
                    once: true,
                });
            });

            this._node.addEventListener('click', (e) => {
                updateMouse(e);

                this.onMouseClick(e.button, e);
            });

            this._node.addEventListener('keydown', (e) => {
                this._keysDown[e.code] = true;

                this.onKeyDown(e.code, e);

                window.addEventListener('keyup', (e) => {
                    delete this._keysDown[e.code];

                    this.onKeyUp(e.code, e);
                }, {
                    once: true,
                });
            });

            this._node.addEventListener('keypress', (e) => {
                this.onKeyPress(e.code, e);
            });
        }

        /**
         * Create a new Canvas with a new canvas element.
         * @param {HTMLElement} [parent] The parent node.
         * @param {number} [width=600] The canvas width.
         * @param {number} [height=400] The canvas height.
         * @return {Canvas} A new Canvas object.
         */
        static attach(parent = document.body, width = 600, height = 400) {
            const canvas = document.createElement('canvas');

            parent.append(canvas);

            return new this(canvas, width, height);
        }
    }

    /**
     * Set the fill color/style.
     * @param {string|CanvasGradient} color The color/gradient.
     * @return {CanvasContext} The CanvasContext.
     */
    function fill(color) {
        this._options.fillStyle = color;

        return this;
    }
    /**
     * Set the font family.
     * @param {string} font The font family.
     * @return {CanvasContext} The CanvasContext.
     */
    function font(font) {
        this._options.font = font;

        return this;
    }
    /**
     * Set the font size.
     * @param {number} size The font size.
     * @return {CanvasContext} The CanvasContext.
     */
    function fontSize(size) {
        this._options.fontSize = size;

        return this;
    }
    /**
     * Set the font weight.
     * @param {string|number} weight The font weight.
     * @return {CanvasContext} The CanvasContext.
     */
    function fontWeight(weight) {
        this._options.fontWeight = weight;

        return this;
    }
    /**
     * Remove the fill color/style.
     * @return {CanvasContext} The CanvasContext.
     */
    function noFill() {
        this._options.fillStyle = null;

        return this;
    }
    /**
     * Remove the shadow.
     * @return {CanvasContext} The CanvasContext.
     */
    function noShadow() {
        this._options.shadowColor = 'rgba(0,0,0,0)';

        return this;
    }
    /**
     * Remove the stroke.
     * @return {CanvasContext} The CanvasContext.
     */
    function noStroke() {
        this._options.strokeStyle = null;

        return this;
    }
    /**
     * Set the shadow color.
     * @param {string|CanvasGradient} color The color.
     * @return {CanvasContext} The CanvasContext.
     */
    function shadow(color) {
        this._options.shadowColor = color;

        return this;
    }
    /**
     * Set the shadow blur amount.
     * @param {number} amount The blur amount.
     * @return {CanvasContext} The CanvasContext.
     */
    function shadowBlur(amount) {
        this._options.shadowBlur = amount;

        return this;
    }
    /**
     * Set the shadow x/y offset.
     * @param {number} [x=0] The X offset.
     * @param {number} [y=0] The Y offset.
     * @return {CanvasContext} The CanvasContext.
     */
    function shadowOffset(x = 0, y = 0) {
        this._options.shadowOffsetX = x;
        this._options.shadowOffsetY = y;

        return this;
    }
    /**
     * Set the stroke color/style.
     * @param {string|CanvasGradient} color The color/gradient.
     * @return {CanvasContext} The CanvasContext.
     */
    function stroke(color) {
        this._options.strokeStyle = color;

        return this;
    }
    /**
     * Set the stroke width.
     * @param {number} width The width.
     * @return {CanvasContext} The CanvasContext.
     */
    function strokeWidth(width) {
        this._options.lineWidth = width;

        return this;
    }
    /**
     * Draw text to the canvas.
     * @param {string} text The text to draw.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function text(text, x, y) {
        this._updateContext();

        const font = [];

        if (this._options.fontWeight) {
            font.push(this._options.fontWeight);
        }

        font.push(`${this._options.fontSize}px`);
        font.push(this._options.font);

        this._context.font = font.join(' ');
        this._context.textAlign = this._options.textAlign;

        if (this._options.fillStyle) {
            this._context.fillText(text, x, y);
        }

        if (this._options.strokeStyle) {
            this._context.strokeText(text, x, y);
        }

        return this;
    }
    /**
     * Set the text alignment.
     * @param {string} aligment The text alignment.
     * @return {CanvasContext} The CanvasContext.
     */
    function textAlign(aligment) {
        this._options.textAlign = aligment;

        return this;
    }
    /**
     * Draw to the canvas.
     */
    function _draw() {
        this._updateContext();

        if (this._options.fillStyle) {
            this._context.fill();
        }

        if (this._options.strokeStyle) {
            this._context.stroke();
        }
    }
    /**
     * Update the canvas context.
     */
    function _updateContext() {
        this._context.fillStyle = this._options.fillStyle;
        this._context.lineWidth = this._options.lineWidth;
        this._context.shadowBlur = this._options.shadowBlur;
        this._context.shadowColor = this._options.shadowColor;
        this._context.shadowOffsetX = this._options.shadowOffsetX;
        this._context.shadowOffsetY = this._options.shadowOffsetY;
        this._context.strokeStyle = this._options.strokeStyle;
    }

    /**
     * Create a linear gradient.
     * @param {number} x1 The starting X position.
     * @param {number} y1 The starting Y position.
     * @param {number} x2 The ending X position.
     * @param {number} y2 The ending Y position.
     * @return {CanvasGradient} The CanvasGradient.
     */
    function linearGradient(x1, y1, x2, y2) {
        return this._context.createLinearGradient(x1, y1, x2, y2);
    }
    /**
     * Create a radial gradient.
     * @param {number} x1 The starting X position.
     * @param {number} y1 The starting Y position.
     * @param {number} r1 Th starting radius.
     * @param {number} x2 The ending X position.
     * @param {number} y2 The ending Y position.
     * @param {number} r2 Th ending radius.
     * @return {CanvasGradient} The CanvasGradient.
     */
    function radialGradient(x1, y1, r1, x2, y2, r2) {
        return this._context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }

    /**
     * Begin a path.
     * @return {CanvasContext} The CanvasContext.
     */
    function begin() {
        this._context.beginPath();
        this._hasVertex = false;

        return this;
    }
    /**
     * Add a bezier vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function bezierVertex$1(cx1, cy1, cx2, cy2, x, y) {
        this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

        return this;
    }
    /**
     * Add a curve vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @return {CanvasContext} The CanvasContext.
     */
    function curveVertex$1(cx1, cy1, cx2, cy2, radius) {
        this._context.arcTo(cx1, cy1, cx2, cy2, radius);

        return this;
    }
    /**
     * End and draw the path.
     * @param {Boolean} [close=false] Whether to close the path.
     * @return {CanvasContext} The CanvasContext.
     */
    function end(close = false) {
        if (close) {
            this._context.closePath();
        }

        this._draw();

        return this;
    }
    /**
     * Add a quadtraic vertex.
     * @param {number} cx The control point X position.
     * @param {number} cy The control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function quadraticVertex$1(cx, cy, x, y) {
        this._context.quadraticCurveTo(cx, cy, x, y);

        return this;
    }
    /**
     * Add a vertex.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function vertex$1(x, y) {
        if (!this._hasVertex) {
            this._context.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._context.lineTo(x, y);
        }

        return this;
    }

    /**
     * Draw an arc.
     * @param {number} x The X position of the arc center.
     * @param {number} y The Y position of the arc center.
     * @param {number} radius The arc radius.
     * @param {number} startAngle The arc start angle.
     * @param {number} endAngle The arc end angle.
     * @return {CanvasContext} The CanvasContext.
     */
    function arc$1(x, y, radius, startAngle, endAngle) {
        this.begin();

        this._context.arc(x, y, radius, startAngle, endAngle);

        return this.end();
    }
    /**
     * Draw a bezier curve.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} x2 The end X position.
     * @param {number} y2 The end Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function bezier$1(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        return this.begin()
            .vertex(x1, y1)
            .bezierVertex(cx1, cy1, cx2, cy2, x2, y2)
            .end();
    }
    /**
     * Draw a circle.
     * @param {number} x The X position of the circle center.
     * @param {number} y The Y position of the circle center.
     * @param {number} radius The circle radius.
     * @return {CanvasContext} The CanvasContext.
     */
    function circle$1(x, y, radius) {
        return this.ellipse(x, y, radius * 2, radius * 2);
    }
    /**
     * Draw a curve.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @return {CanvasContext} The CanvasContext.
     */
    function curve$1(x1, y1, cx1, cy1, cx2, cy2, radius) {
        return this.begin()
            .vertex(x1, y1)
            .curveVertex(cx1, cy1, cx2, cy2, radius)
            .end();
    }
    /**
     * Draw an ellipse.
     * @param {number} x The X position of the ellipse center.
     * @param {number} y The Y position of the ellipse center.
     * @param {number} width The ellipse width.
     * @param {number} height The ellipse height.
     * @param {number} [angle=0] The ellipse angle.
     * @return {CanvasContext} The CanvasContext.
     */
    function ellipse$1(x, y, width, height, angle = 0) {
        this.begin();

        this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);

        return this.end();
    }
    /**
     * Draw a line.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} x2 The end X position.
     * @param {number} y2 The end Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function line$1(x1, y1, x2, y2) {
        return this.begin()
            .vertex(x1, y1)
            .vertex(x2, y2)
            .end();
    }
    /**
     * Draw a point.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function point(x, y) {
        const { lineWidth, strokeStyle } = this._options;

        return this.push()
            .noStroke()
            .fill(strokeStyle)
            .circle(x, y, lineWidth)
            .pop();
    }
    /**
     * Draw a quadratic.
     * @param {number} x1 The first X position.
     * @param {number} y1 The first Y position.
     * @param {number} x2 The second X position.
     * @param {number} y2 The second Y position.
     * @param {number} x3 The third X position.
     * @param {number} y3 The third Y position.
     * @param {number} x4 The fourth X position.
     * @param {number} y4 The fourth Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function quad$1(x1, y1, x2, y2, x3, y3, x4, y4) {
        return this.begin()
            .vertex(x1, y1)
            .vertex(x2, y2)
            .vertex(x3, y3)
            .vertex(x4, y4)
            .end(true);
    }
    /**
     * Draw a rectangle.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} width The rectangle width.
     * @param {number} height The rectangle height.
     * @return {CanvasContext} The CanvasContext.
     */
    function rect$1(x, y, width, height) {
        this.begin();

        this._context.rect(x, y, width, height);

        return this.end();
    }
    /**
     * Draw a square.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} size The square size.
     * @return {CanvasContext} The CanvasContext.
     */
    function square$1(x, y, size) {
        return this.rect(x, y, size, size);
    }
    /**
     * Draw a triangle.
     * @param {number} x1 The first X position.
     * @param {number} y1 The first Y position.
     * @param {number} x2 The second X position.
     * @param {number} y2 The second Y position.
     * @param {number} x3 The third X position.
     * @param {number} y3 The third Y position.
     * @return {CanvasContext} The CanvasContext.
     */
    function triangle$1(x1, y1, x2, y2, x3, y3) {
        return this.begin()
            .vertex(x1, y1)
            .vertex(x2, y2)
            .vertex(x3, y3)
            .end(true);
    }

    // CanvasContext default options
    CanvasContext.defaults = {
        fillStyle: null,
        font: 'sans-serif',
        fontSize: 10,
        fontWeight: null,
        lineWidth: 1,
        shadowBlur: 0,
        shadowColor: null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeStyle: '#000',
    };

    // CanvasContext prototype
    const proto$1 = CanvasContext.prototype;

    proto$1.arc = arc$1;
    proto$1.begin = begin;
    proto$1.bezier = bezier$1;
    proto$1.bezierVertex = bezierVertex$1;
    proto$1.circle = circle$1;
    proto$1.curve = curve$1;
    proto$1.curveVertex = curveVertex$1;
    proto$1.ellipse = ellipse$1;
    proto$1.end = end;
    proto$1.fill = fill;
    proto$1.font = font;
    proto$1.fontSize = fontSize;
    proto$1.fontWeight = fontWeight;
    proto$1.line = line$1;
    proto$1.linearGradient = linearGradient;
    proto$1.noFill = noFill;
    proto$1.noShadow = noShadow;
    proto$1.noStroke = noStroke;
    proto$1.point = point;
    proto$1.quad = quad$1;
    proto$1.quadraticVertex = quadraticVertex$1;
    proto$1.radialGradient = radialGradient;
    proto$1.rect = rect$1;
    proto$1.shadow = shadow;
    proto$1.shadowBlur = shadowBlur;
    proto$1.shadowOffset = shadowOffset;
    proto$1.square = square$1;
    proto$1.stroke = stroke;
    proto$1.strokeWidth = strokeWidth;
    proto$1.text = text;
    proto$1.textAlign = textAlign;
    proto$1.triangle = triangle$1;
    proto$1.vertex = vertex$1;
    proto$1._draw = _draw;
    proto$1._updateContext = _updateContext;

    /**
     * Add a bezier vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {Path} The Path.
     */
    function bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

        this._setBounds([cx1, cx2, x], [cy1, cy2, y]);

        return this;
    }
    /**
     * Close the path.
     * @return {Path} The Path.
     */
    function close() {
        this._path.closePath();

        return this;
    }
    /**
     * Add a curve vertex.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @return {Path} The Path.
     */
    function curveVertex(cx1, cy1, cx2, cy2, radius) {
        this._path.arcTo(cx1, cy1, cx2, cy2, radius);

        this._setBounds([cx1, cx2], [cy1, cy2]);

        return this;
    }
    /**
     * Add a quadtraic vertex.
     * @param {number} cx The control point X position.
     * @param {number} cy The control point Y position.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {Path} The Path.
     */
    function quadraticVertex(cx, cy, x, y) {
        this._path.quadraticCurveTo(cx, cy, x, y);

        this._setBounds([cx, x], [cy, y]);

        return this;
    }
    /**
     * Add a vertex.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @return {Path} The Path.
     */
    function vertex(x, y) {
        if (!this._hasVertex) {
            this._path.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._path.lineTo(x, y);
        }

        this._setBounds([x], [y]);
        return this;
    }

    /**
     * Add an arc.
     * @param {number} x The X position of the arc center.
     * @param {number} y The Y position of the arc center.
     * @param {number} radius The arc radius.
     * @param {number} startAngle The arc start angle.
     * @param {number} endAngle The arc end angle.
     * @return {Path} The Path.
     */
    function arc(x, y, radius, startAngle, endAngle) {
        this._path.arc(x, y, radius, startAngle, endAngle);

        this._setBounds([x - radius, x + radius], [y - radius, y + radius]);

        return this;
    }
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
     * @return {Path} The Path.
     */
    function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        this._path.moveTo(x1, y1);
        this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);

        this._setBounds([x1, cx1, cx2, x2], [y1, cy1, cy2, y2]);

        return this;
    }
    /**
     * Add a circle.
     * @param {number} x The X position of the circle center.
     * @param {number} y The Y position of the circle center.
     * @param {number} radius The circle radius.
     * @return {Path} The Path.
     */
    function circle(x, y, radius) {
        return this.ellipse(x, y, radius * 2, radius * 2);
    }
    /**
     * Add a curve.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} cx1 The first control point X position.
     * @param {number} cy1 The first control point Y position.
     * @param {number} cx2 The second control point X position.
     * @param {number} cy2 The second control point Y position.
     * @param {number} radius The arc radius.
     * @return {Path} The Path.
     */
    function curve(x1, y1, cx1, cy1, cx2, cy2, radius) {
        this._path.moveTo(x1, y1);
        this._path.arcTo(cx1, cy1, cx2, cy2, radius);

        this._setBounds([x1, cx1, cx2], [y1, cy1, cy2]);

        return this;
    }
    /**
     * Add an ellipse.
     * @param {number} x The X position of the ellipse center.
     * @param {number} y The Y position of the ellipse center.
     * @param {number} width The ellipse width.
     * @param {number} height The ellipse height.
     * @param {number} [angle=0] The ellipse angle.
     * @return {Path} The Path.
     */
    function ellipse(x, y, width, height, angle = 0) {
        const xRadius = width / 2;
        const yRadius = height / 2;

        this._path.ellipse(x, y, xRadius, yRadius, angle, 0, Math.PI * 2);

        this._setBounds([x - xRadius, x + xRadius], [y - yRadius, y + yRadius]);

        return this;
    }
    /**
     * Add a line.
     * @param {number} x1 The start X position.
     * @param {number} y1 The start Y position.
     * @param {number} x2 The end X position.
     * @param {number} y2 The end Y position.
     * @return {Path} The Path.
     */
    function line(x1, y1, x2, y2) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);

        this._setBounds([x1, x2], [y1, y2]);

        return this;
    }
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
     * @return {Path} The Path.
     */
    function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.lineTo(x4, y4);
        this._path.closePath();

        this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);

        return this;
    }
    /**
     * Add a rectangle.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} width The rectangle width.
     * @param {number} height The rectangle height.
     * @return {Path} The Path.
     */
    function rect(x, y, width, height) {
        this._path.rect(x, y, width, height);

        this._setBounds([x, x + width], [y, y + height]);

        return this;
    }
    /**
     * Add a square.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {number} size The square size.
     * @return {Path} The Path.
     */
    function square(x, y, size) {
        return this.rect(x, y, size, size);
    }
    /**
     * Add a triangle.
     * @param {number} x1 The first X position.
     * @param {number} y1 The first Y position.
     * @param {number} x2 The second X position.
     * @param {number} y2 The second Y position.
     * @param {number} x3 The third X position.
     * @param {number} y3 The third Y position.
     * @return {Path} The Path.
     */
    function triangle(x1, y1, x2, y2, x3, y3) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.closePath();

        this._setBounds([x1, x2, x3], [y1, y2, y3]);

        return this;
    }

    // Path prototype
    const proto = Path.prototype;

    proto.arc = arc;
    proto.bezier = bezier;
    proto.bezierVertex = bezierVertex;
    proto.circle = circle;
    proto.close = close;
    proto.curve = curve;
    proto.curveVertex = curveVertex;
    proto.ellipse = ellipse;
    proto.line = line;
    proto.quad = quad;
    proto.quadraticVertex = quadraticVertex;
    proto.rect = rect;
    proto.square = square;
    proto.triangle = triangle;
    proto.vertex = vertex;

    exports.Canvas = Canvas;
    exports.CanvasContext = CanvasContext;
    exports.Path = Path;
    exports.Shape = Shape;
    exports.Vector = Vector;

}));
//# sourceMappingURL=f5.js.map
