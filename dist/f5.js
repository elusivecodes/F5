/**
 * F5 v1.0
 * https://github.com/elusivecodes/FrostUI
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        Object.assign(global, factory());
    }

})(window, function() {
    'use strict';

    class Canvas {

        constructor(node, width = 600, height = 400, settings) {
            this._node = node;
            this._context = this._node.getContext('2d');

            this.reset();

            if (settings) {
                Object.assign(this._settings, settings);
            }

            this._states = [];
            this._hasVertex = false;

            this.resize(width, height);
        }

        applyMatrix(a, b, c, d, e, f) {
            this._context.transform(a, b, c, d, e, f);

            return this;
        }

        background(color) {
            this.push();
            this.fillColor(color);
            this.rect(0, 0, this.width, this.height);
            this.pop();

            return this;
        }

        clear() {
            this._context.clearRect(0, 0, this.width, this.height);

            return this;
        }

        createShape(x = 0, y = 0, rotation = 0) {
            return new Shape(this._context, x, y, rotation);
        }

        createPath() {
            return new Path(this._context);
        }

        drawImage(image, x = 0, y = 0) {
            this._context.drawImage(image, x, y);

            return this;
        }

        drawPath(path, x = 0, y = 0) {
            const bounds = path.getBoundingBox();
            const { canvas } = path.render(this._settings);

            return this.drawImage(canvas, bounds.x + x, bounds.y + y);
        }

        drawShape(shape, x = 0, y = 0) {
            const bounds = shape.getBoundingBox();
            const { canvas } = shape.render(this._settings);

            return this.drawImage(canvas, bounds.x + x, bounds.y + y);
        }

        erase(callback) {
            this.push();
            this.reset();
            const path = this.createPath();
            callback(path);
            this._context.globalCompositeOperation = 'destination-out';
            this.fillColor('#000');
            this.drawPath(path);
            this.pop();

            return this;
        }

        getImage(x, y, w, h) {
            return this._context.getImageData(x, y, w, h);
        }

        pop() {
            this._settings = this._states.pop();
            this._context.restore();

            return this;
        }

        push() {
            this._states.push(this._settings);
            this._context.save();

            return this;
        }

        putImage(image, x, y, dx, dy, dw, dh) {
            if (arguments.length > 3) {
                this._context.putImageData(image, x, y, dx, dy, dw, dh);
            } else {
                this._context.putImageData(image, x, y);
            }

            return this;
        }

        reset() {
            this._settings = {
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

            return this.resetMatrix();
        }

        resetMatrix() {
            this._context.resetTransform();

            return this;
        }

        resize(w, h) {
            this.width = w;
            this.height = h;
            this._node.setAttribute('width', this.width);
            this._node.setAttribute('height', this.height);

            return this;
        }

        rotate(angle) {
            this._context.rotate(angle);

            return this;
        }

        scale(x, y = null) {
            if (y === undefined) {
                y = x;
            }

            this._context.scale(x, y);

            return this;
        }

        translate(x, y) {
            this._context.translate(x, y);

            return this;
        }

        static create(node, width = 600, height = 400, settings) {
            return new this(node, width, height, settings);
        }

    }


    Object.assign(Canvas.prototype, {

        fillColor(color) {
            this._settings.fillStyle = color;

            return this;
        },

        font(font) {
            this._settings.font = font;

            return this;
        },

        fontSize(size) {
            this._settings.fontSize = size;

            return this;
        },

        fontWeight(weight) {
            this._settings.fontWeight = weight;

            return this;
        },

        noFill() {
            this._settings.fillStyle = null;

            return this;
        },

        noShadow() {
            this._settings.shadowColor = 'rgba(0,0,0,0)';

            return this;
        },

        noStroke() {
            this._settings.strokeStyle = null;

            return this;
        },

        shadowBlur(amount) {
            this._settings.shadowBlur = amount;

            return this;
        },

        shadowColor(color) {
            this._settings.shadowColor = color;

            return this;
        },

        shadowOffset(x, y) {
            this._settings.shadowOffsetX = x;
            this._settings.shadowOffsetY = y;

            return this;
        },

        strokeColor(color) {
            this._settings.strokeStyle = color;

            return this;
        },

        strokeWidth(width) {
            this._settings.lineWidth = width;

            return this;
        },

        text(text, x, y) {
            this._updateContext();

            if (this._settings.fillStyle) {
                this._context.fillText(text, x, y);
            }

            if (this._settings.strokeStyle) {
                this._context.strokeText(text, x, y);
            }

            return this;
        },

        textAlign(aligment) {
            this._settings.textAlign = aligment;

            return this;
        },

        _draw() {
            this._updateContext();

            if (this._settings.fillStyle) {
                this._context.fill();
            }

            if (this._settings.strokeStyle) {
                this._context.stroke();
            }

            return this;
        },

        _updateContext() {
            const font = [];

            if (this._settings.fontWeight) {
                font.push(this._settings.fontWeight);
            }

            font.push(`${this._settings.fontSize}px`);
            font.push(this._font);

            this._context.fillStyle = this._settings.fillStyle;
            this._context.font = font.join(' ');
            this._context.lineWidth = this._settings.lineWidth;
            this._context.shadowBlur = this._settings.shadowBlur;
            this._context.shadowColor = this._settings.shadowColor;
            this._context.shadowOffsetX = this._settings.shadowOffsetX;
            this._context.shadowOffsetY = this._settings.shadowOffsetY;
            this._context.strokeStyle = this._settings.strokeStyle;
            this._context.textAlign = this._settings.textAlign;
        }

    });


    Object.assign(Canvas.prototype, {

        linear(x1, y1, x2, y2) {
            return this._context.createLinearGradient(x1, y1, x2, y2);
        },

        radial(x1, y1, r1, x2, y2, r2) {
            return this._context.createRadialGradient(x1, y1, r1, x2, y2, r2);
        }

    });


    Object.assign(Canvas.prototype, {

        begin() {
            this._context.beginPath();
            this._hasVertex = false;

            return this;
        },

        bezierVertex(cx1, cy1, cx2, cy2, x, y) {
            this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

            return this;
        },

        curveVertex(x1, y1, x2, y2, radius) {
            this._context.arcTo(x1, y1, x2, y2, radius);

            return this;
        },

        end(close = false) {
            if (close) {
                this._context.closePath();
            }

            this._draw();
        },

        quadraticVertex(cx, cy, x, y) {
            this._context.quadraticCurveTo(cx, cy, x, y);

            return this;
        },

        vertex(x, y) {
            if (!this._hasVertex) {
                this._context.moveTo(x, y);
                this._hasVertex = true;
            } else {
                this._context.lineTo(x, y);
            }

            return this;
        }

    });


    Object.assign(Canvas.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this.begin();

            this._context.arc(x, y, radius, startAngle, endAngle);

            return this.end();
        },

        bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
            this.begin();

            this.vertex(x1, y1);
            this.bezierVertex(x2, y2, x3, y3, x4, y4);

            return this.end();
        },

        circle(x, y, diameter) {
            return this.ellipse(x, y, diameter, diameter);
        },

        curve(x1, y1, x2, y2, x3, y3, x4, y4) {
            this.begin();

            this.vertex(x1, y1);
            this.curveTo(x2, y2, x3, y3, x4, y4);

            return this.end();
        },

        ellipse(x, y, width, height, angle = 0) {
            this.begin();

            this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);

            return this.end();
        },

        line(x1, y1, x2, y2) {
            this.begin();

            this.vertex(x1, y1);
            this.vertex(x2, y2);

            return this.end();
        },

        point(x, y) {
            this.begin();

            this.vertex(x, y);

            return this.end();
        },

        quad(x1, y1, x2, y2, x3, y3, x4, y4) {
            this.begin();

            this.vertex(x1, y1);
            this.vertex(x2, y2);
            this.vertex(x3, y3);
            this.vertex(x4, y4);

            return this.end(true);
        },

        rect(x, y, width, height) {
            this.begin();

            this._context.rect(x, y, width, height);

            return this.end();
        },

        square(x, y, size) {
            return this.rect(x, y, size, size);
        },

        triangle(x1, y1, x2, y2, x3, y3) {
            this.begin();

            this.vertex(x1, y1);
            this.vertex(x2, y2);
            this.vertex(x3, y3);

            return this.end(true);
        }

    });


    class F5 {

        constructor(node, width = 600, height = 400) {
            this._node = node;
            this._loop = true;

            this.canvas = Canvas.create(this._node, width, height);
            this.input = new Input(this);

            const start = Date.now();

            const run = _ => {
                const now = Date.now();
                const delta = (now - start) / 1000;

                this.update(delta);

                if (this._loop) {
                    window.requestAnimationFrame(_ => {
                        run();
                    });
                }
            };

            this.setup();

            run();
        }

        noLoop() {
            this._loop = false;

            return this;
        }

        setup() { }

        update() { }

        static create(node, width = 600, height = 400) {
            return new this(node, width, height);
        }

        static createCanvas(parent = document.body, width = 600, height = 400) {
            const canvas = document.createElement('canvas');

            parent.append(canvas);

            return new this(canvas, width, height);
        }

    }


    class Input {

        constructor(f5) {
            const node = f5._node;
            node.setAttribute('tabindex', '1');
            node.style.setProperty('outline', '0');

            this._mouseX = null;
            this._mouseY = null;
            this._mouseDown = {};
            this._keysDown = {};

            const hasCallback = callback => callback in f5;

            if (hasCallback('onMouseEnter')) {
                node.addEventListener('mouseenter', _ => {
                    f5.onMouseEnter();
                });
            }

            node.addEventListener('mouseleave', _ => {
                this._mouseX = null;
                this._mouseY = null;

                if (hasCallback('onMouseLeave')) {
                    f5.onMouseLeave();
                }
            });

            node.addEventListener('mousemove', e => {
                this._mouseX = e.offsetX;
                this._mouseY = e.offsetY;

                if (hasCallback('onMouseMove')) {
                    f5.onMouseMove();
                }
            });

            node.addEventListener('mousedown', e => {
                this._mouseDown[e.button] = true;

                if (hasCallback('onMouseDown')) {
                    f5.onMouseDown();
                }

                window.addEventListener('mouseup', e => {
                    delete this._mouseDown[e.button];

                    if (hasCallback('onMouseUp')) {
                        f5.onMouseUp();
                    }
                }, {
                    once: true
                });
            });

            node.addEventListener('keydown', e => {
                this._keysDown[e.code] = true;

                if (hasCallback('onKeyDown')) {
                    f5.onKeyDown(e.code);
                }

                window.addEventListener('keyup', e => {
                    delete this._keysDown[e.code];

                    if (hasCallback('onKeyUp')) {
                        f5.onKeyUp(e.code);
                    }
                }, {
                    once: true
                });
            });

            if (hasCallback('onMouseClick')) {
                node.addEventListener('click', _ => {
                    f5.onMouseClick();
                });
            }

            if (hasCallback('onKeyPress')) {
                node.addEventListener('keypress', e => {
                    f5.onKeyPress(e.code);
                });
            }

        }

        isKeyPressed(code) {
            return code ?
                code in this._keysDown :
                Object.keys(this._keysDown).length;
        }

        isMousePressed(button = 0) {
            return button in this._mouseDown && this._mouseX !== null && this._mouseY !== null;
        }

        mousePos() {
            if (this._mouseX === null || this._mouseY === null) {
                return null;
            }

            return new Vector(this._mouseX, this._mouseY);
        }

    }


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


    Object.assign(Path.prototype, {

        bezierVertex(cx1, cy1, cx2, cy2, x, y) {
            this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

            return this._setBounds([cx1, cx2, x], [cy1, cy2, y]);
        },

        close() {
            this._path.closePath();

            return this;
        },

        curveVertex(x1, y1, x2, y2, radius) {
            this._path.arcTo(x1, y1, x2, y2, radius);

            return this._setBounds([x1, x2], [y1, y2]);
        },

        quadraticVertex(cx, cy, x, y) {
            this._path.quadraticCurveTo(cx, cy, x, y);

            return this._setBounds([cx, x], [cy, y]);
        },

        vertex(x, y) {
            if (!this._hasVertex) {
                this._path.moveTo(x, y);
                this._hasVertex = true;
            } else {
                this._path.lineTo(x, y);
            }

            return this._setBounds([x], [y]);;
        }

    });


    Object.assign(Path.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this._path.arc(x, y, radius, startAngle, endAngle);

            return this._setBounds([x - radius, x + radius], [y - radius, y + radius]);
        },

        bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._path.moveTo(x1, y1);
            this._path.bezierCurveTo(x2, y2, x3, y3, x4, y4);

            return this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        },

        circle(x, y, diameter) {
            return this.ellipse(x, y, diameter, diameter);
        },

        curve(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._path.moveTo(x1, y1);
            this._path.arcTo(x2, y2, x3, y3, x4, y4);

            return this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        },

        ellipse(x, y, width, height, angle = 0) {
            const xRadius = width / 2;
            const yRadius = height / 2;

            this._path.ellipse(x, y, xRadius, yRadius, angle, 0, Math.PI * 2);

            return this._setBounds([x - xRadius, x + xRadius], [y - yRadius, y + yRadius]);
        },

        line(x1, y1, x2, y2) {
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);

            return this._setBounds([x1, x2], [y1, y2]);
        },

        quad(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
            this._path.lineTo(x3, y3);
            this._path.lineTo(x4, y4);
            this._path.closePath();

            return this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        },

        rect(x, y, width, height) {
            this._path.rect(x, y, width, height);

            return this._setBounds([x, x + width], [y, y + height]);
        },

        square(x, y, size) {
            return this.rect(x, y, size, size);
        },

        triangle(x1, y1, x2, y2, x3, y3) {
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
            this._path.lineTo(x3, y3);
            this._path.closePath();

            return this._setBounds([x1, x2, x3], [y1, y2, y3]);
        }

    });


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


    class Vector {

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        add(...args) {
            const { x, y } = this.constructor._parse(...args);

            this.x += x;
            this.y += y;

            return this;
        }

        angleTo(...args) {
            const { x, y } = this.constructor._parse(...args);

            return Math.atan2(y, x) - this.getHeading();
        };

        clone() {
            return new this.constructor(this.x, this.y);
        }

        distTo(...args) {
            const { x, y } = this.constructor._parse(...args);

            return Math.hypot(x - this.x, y - this.y);
        }

        div(...args) {
            const { x, y } = this.constructor._parse(...args);

            this.x /= x;
            this.y /= y;

            return this;
        }

        dot(...args) {
            const { x, y } = this.constructor._parse(...args);

            this.x *= y;
            this.y *= x;

            return this;
        }

        getHeading() {
            return Math.atan2(this.y, this.x);
        }

        getMag() {
            return Math.hypot(this.x, this.y);
        }

        limit(limit) {
            if (this.getMag() > limit) {
                return this.setMag(limit);
            }

            return this;
        }

        mult(...args) {
            const { x, y } = this.constructor._parse(...args);

            this.x *= x;
            this.y *= y;

            return this;
        }

        normalize() {
            return this.setMag(1);
        }

        rotate(angle) {
            angle += this.getHeading();

            const mag = this.getMag();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        setHeading(angle) {
            const mag = this.getMag();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        setMag(mag) {
            const angle = this.getHeading();

            this.x = Math.cos(angle) * mag;
            this.y = Math.sin(angle) * mag;

            return this;
        }

        sub(...args) {
            const { x, y } = this.constructor._parse(...args);

            this.x -= x;
            this.y -= y;

            return this;
        }

        static create(x, y) {
            return new this(x, y);
        }

        static random() {
            return new this(Math.random(), Math.random());
        }

        static _parse(x, y) {
            if (x instanceof Vector) {
                y = x.y;
                x = x.x;
            } else if (y === undefined) {
                y = x;
            }

            return { x, y };
        }

    }

    F5.Canvas = Canvas;
    F5.Input = Input;
    F5.Path = Path;
    F5.Shape = Shape;
    F5.Vector = Vector;

    return {
        F5
    };
});