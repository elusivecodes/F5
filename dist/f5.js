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

        constructor(node, width = 600, height = 400, settings = {}) {
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
        }

        background(color) {
            this.fillColor(color);
            this.begin();
            this._context.rect(0, 0, this.width, this.height);
            this.end();
        }

        clear() {
            this._context.clearRect(0, 0, this.width, this.height);
        }

        createShape() {
            return new Shape(this._context);
        }

        createPath() {
            return new Path(this._context);
        }

        drawImage(image, x = 0, y = 0) {
            this._context.drawImage(image, x, y);
        }

        drawPath(path, x = 0, y = 0) {
            const boundingBox = path.getBoundingBox();
            const { canvas } = path.render({
                fillStyle: this._context.fillStyle,
                lineWidth: this._context.lineWidth,
                strokeStyle: this._context.strokeStyle
            });
            this.drawImage(canvas, boundingBox.x + x, boundingBox.y + y);
        }

        drawShape(shape, x = 0, y = 0) {
            const boundingBox = shape.getBoundingBox();
            const { canvas } = shape.render({
                fillStyle: this._context.fillStyle,
                lineWidth: this._context.lineWidth,
                strokeStyle: this._context.strokeStyle
            });
            this.drawImage(canvas, boundingBox.x + x, boundingBox.y + y);
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
        }

        getImage(x, y, w, h) {
            return this._context.getImageData(x, y, w, h);
        }

        pop() {
            this._settings = this._states.pop();
            this._context.restore();
        }

        push() {
            this._states.push(this._settings);
            this._context.save();
        }

        putImage(image, x, y, dx, dy, dw, dh) {
            if (arguments.length > 3) {
                this._context.putImageData(image, x, y, dx, dy, dw, dh);
            } else {
                this._context.putImageData(image, x, y);
            }
        }

        reset() {
            this._settings = {
                fill: false,
                stroke: false,
                shadow: false,
                font: 'sans-serif',
                fontSize: 10,
                fontWeight: null
            };

            this.resetMatrix();
        }

        resetMatrix() {
            this._context.resetTransform();
        }

        resize(w, h) {
            this.width = w;
            this.height = h;
            this._node.setAttribute('width', this.width);
            this._node.setAttribute('height', this.height);
        }

        rotateX(angle) {
            this._context.rotateX(angle);
        }

        rotateY(angle) {
            this._context.rotateY(angle);
        }

        rotateZ(angle) {
            this._context.rotateZ(angle);
        }

        scale(x, y = null) {
            if (y === undefined) {
                y = x;
            }

            this._context.scale(x, y);
        }

        translate(x, y) {
            this._context.translate(x, y);
        }

    }


    Object.assign(Canvas.prototype, {

        fillColor(color) {
            this._settings.fill = true;
            this._context.fillStyle = color;
        },

        noFill() {
            this._settings.fill = false;
            this._context.fillStyle = '#000';
        },

        noShadow() {
            this._settings.shadow = false;
            this._context.shadowColor = 'rgba(0,0,0,0)';
        },

        noStroke() {
            this._settings.shadow = false;
            this._context.strokeStyle = '#000';
        },

        shadowBlur(amount) {
            this._context.shadowBlur = amount;
        },

        shadowColor(color) {
            this._settings.shadow = true;
            this._context.shadowColor = color;
        },

        shadowOffset(x, y) {
            this._context.shadowOffsetX = x;
            this._context.shadowOffsetY = y;
        },

        strokeColor(color) {
            this._settings.stroke = true;
            this._context.strokeStyle = color;
        },

        strokeWidth(width) {
            this._context.lineWidth = width;
        }

    });


    Object.assign(Canvas.prototype, {

        addStop(gradient, stop, color) {
            gradient.addColorStop(stop, color);
        },

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
        },

        bezierVertex(cx1, cy1, cx2, cy2, x, y) {
            this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
        },

        curveVertex(x1, y1, x2, y2, radius) {
            this._context.arcTo(x1, y1, x2, y2, radius);
        },

        end(close = false) {
            if (close) {
                this._context.closePath();
            }

            if (this._settings.fill) {
                this._context.fill();
            }

            if (this._settings.stroke) {
                this._context.stroke();
            }
        },

        quadraticVertex(cx, cy, x, y) {
            this._context.quadraticCurveTo(cx, cy, x, y);
        },

        vertex(x, y) {
            if (!this._hasVertex) {
                this._context.moveTo(x, y);
                this._hasVertex = true;
            } else {
                this._context.lineTo(x, y);
            }
        }

    });


    Object.assign(Canvas.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this._context.beginPath();
            this._context.arc(x, y, radius, startAngle, endAngle);
            this.end();
        },

        bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            this.end();
        },

        circle(x, y, diameter) {
            this.ellipse(x, y, diameter, diameter);
        },

        curve(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.arcTo(x2, y2, x3, y3, x4, y4);
            this.end();
        },

        ellipse(x, y, width, height, angle = 0) {
            this._context.beginPath();
            this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
            this.end();
        },

        line(x1, y1, x2, y2) {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this._context.stroke();
        },

        point(x, y) {
            this._context.beginPath();
            this._context.moveTo(x, y);
            this._context.stroke();
        },

        quad(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this._context.lineTo(x3, y3);
            this._context.lineTo(x4, y4);
            this.end(true);
        },

        rect(x, y, width, height) {
            this._context.beginPath();
            this._context.rect(x, y, width, height);
            this.end();
        },

        square(x, y, size) {
            this.rect(x, y, size, size);
        },

        triangle(x1, y1, x2, y2, x3, y3) {
            this._context.beginPath();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this._context.lineTo(x3, y3);
            this.end(true);
        }

    });


    Object.assign(Canvas.prototype, {

        font(font) {
            this._font = font;
        },

        fontSize(size) {
            this._fontSize = size;
        },

        fontWeight(weight) {
            this._fontWeight = weight;
        },

        text(text, x, y) {
            let font = [];

            if (this._settings.fontWeight) {
                font.push(this._settings.fontWeight);
            }

            if (this._settings.fontSize) {
                font.push(`${this._settings.fontSize}px`);
            }

            font.push(this._font);

            this._context.font = font.join(' ');

            if (this._settings.fill) {
                this._context.fillText(text, x, y);
            }

            if (this._settings.stroke) {
                this._context.strokeText(text, x, y);
            }
        },

        textAlign(aligment) {
            this._context.textAlign = aligment;
        }

    });


    class F5 {

        constructor(node, width, height) {
            this._node = node;
            this._loop = true;

            this.canvas = new Canvas(this._node, width, height);
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
        }

        setup() { }

        update() { }

    }


    class Input {

        constructor(f5) {
            this._f5 = f5;

            this._f5._node.setAttribute('tabindex', '1');
            this._f5._node.style.setProperty('outline', '0');

            this._mouseX = null;
            this._mouseY = null;
            this._mouseDown = {};
            this._keysDown = {};

            if (this._f5.onMouseEnter) {
                this._f5._node.addEventListener('mouseenter', _ => {
                    this._f5.onMouseEnter();
                });
            }

            this._f5._node.addEventListener('mouseleave', _ => {
                this._mouseX = null;
                this._mouseY = null;

                if (this._f5.onMouseLeave) {
                    this._f5.onMouseLeave();
                }
            });

            this._f5._node.addEventListener('mousemove', e => {
                this._mouseX = e.offsetX;
                this._mouseY = e.offsetY;

                if (this._f5.onMouseMove) {
                    this._f5.onMouseMove();
                }
            });

            this._f5._node.addEventListener('mousedown', e => {
                this._mouseDown[e.button] = true;

                if (this._f5.onMouseDown) {
                    this._f5.onMouseDown();
                }
            });

            document.addEventListener('mouseup', e => {
                delete this._mouseDown[e.button];

                if (this._f5.onMouseUp) {
                    this._f5.onMouseUp();
                }
            });

            this._f5._node.addEventListener('keydown', e => {
                this._keysDown[e.code] = true;

                if (this._f5.onKeyDown) {
                    this._f5.onKeyDown(e.code);
                }
            });

            window.addEventListener('keyup', e => {
                delete this._keysDown[e.code];

                if (this._f5.onKeyUp) {
                    this._f5.onKeyUp(e.code);
                }
            });

            if (this._f5.onMouseClick) {
                this._f5._node.addEventListener('click', _ => {
                    this._f5.onMouseClick();
                });
            }

            if (this._f5.onKeyPress) {
                this._f5.node.addEventListener('keypress', e => {
                    this._f5.onKeyPress(e.code);
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


    Object.assign(Path.prototype, {

        bezierVertex(cx1, cy1, cx2, cy2, x, y) {
            this._setBounds([cx1, cx2, x], [cy1, cy2, y]);
            this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
        },

        close() {
            this._path.closePath();
        },

        curveVertex(x1, y1, x2, y2, radius) {
            this._setBounds([x1, x2], [y1, y2]);
            this._path.arcTo(x1, y1, x2, y2, radius);
        },

        quadraticVertex(cx, cy, x, y) {
            this._setBounds([cx, x], [cy, y]);
            this._path.quadraticCurveTo(cx, cy, x, y);
        },

        vertex(x, y) {
            this._setBounds([x], [y]);

            if (!this._hasVertex) {
                this._path.moveTo(x, y);
                this._hasVertex = true;
            } else {
                this._path.lineTo(x, y);
            }
        }

    });


    Object.assign(Path.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this._setBounds([x - radius, x + radius], [y - radius, y + radius]);
            this._path.arc(x, y, radius, startAngle, endAngle);
        },

        bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
            this._path.moveTo(x1, y1);
            this._path.bezierCurveTo(x2, y2, x3, y3, x4, y4);
        },

        circle(x, y, diameter) {
            this.ellipse(x, y, diameter, diameter);
        },

        curve(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
            this._path.moveTo(x1, y1);
            this._path.arcTo(x2, y2, x3, y3, x4, y4);
        },

        ellipse(x, y, width, height, angle = 0) {
            const xRadius = width / 2;
            const yRadius = height / 2;
            this._setBounds([x - xRadius, x + xRadius], [y - yRadius, y + yRadius]);
            this._path.ellipse(x, y, xRadius, yRadius, angle, 0, Math.PI * 2);
        },

        line(x1, y1, x2, y2) {
            this._setBounds([x1, x2], [y1, y2]);
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
        },

        quad(x1, y1, x2, y2, x3, y3, x4, y4) {
            this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
            this._path.lineTo(x3, y3);
            this._path.lineTo(x4, y4);
            this._path.closePath();
        },

        rect(x, y, width, height) {
            this._setBounds([x, x + width], [y, y + height]);
            this._path.rect(x, y, width, height);
        },

        square(x, y, size) {
            this.rect(x, y, size, size);
        },

        triangle(x1, y1, x2, y2, x3, y3) {
            this._setBounds([x1, x2, x3], [y1, y2, y3]);
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
            this._path.lineTo(x3, y3);
            this._path.closePath();
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

            if (bounds.top > otherBounds.top || bounds.right < otherBounds.right || bounds.bottom < otherBounds.bottom || bounds.left > otherBounds.left) {
                return false;
            }

            const { canvas } = this.render();
            const { context } = shape.render();

            context.globalCompositeOperation = 'destination-out';
            context.drawImage(canvas, bounds.x - otherBounds.x, bounds.y - otherBounds.y);

            return this._isContextBlank(context, otherBounds.width, otherBounds.height);
        }

        containsPoint(x, y) {
            let pointInShape = false;
            for (const { contour, path } of this._layers) {
                if (pointInShape && !contour) {
                    continue;
                }

                if (!pointInShape && contour) {
                    continue;
                }

                const pointInPath = path.containsPoint(x, y);

                if (!pointInPath) {
                    continue;
                }

                pointInShape = !pointInShape;
            }

            return pointInShape;
        }

        contour(callback) {
            this.layer(callback, true);
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

            if (bounds.top > otherBounds.bottom || bounds.right < otherBounds.left || bounds.bottom < otherBounds.top || bounds.left > otherBounds.right) {
                return false;
            }

            const { context } = this.render();
            const { canvas } = shape.render();

            context.globalCompositeOperation = 'destination-in';
            context.drawImage(canvas, otherBounds.x - bounds.x, otherBounds.y - bounds.y);

            return !this._isContextBlank(context, bounds.width, bounds.height);
        }

        layer(callback, contour = false) {
            const path = new Path(this._context);
            callback(path);
            this._addLayer(path, contour);
        }

        render(options) {
            const boundingBox = this.getBoundingBox();

            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', boundingBox.width);
            canvas.setAttribute('height', boundingBox.height);

            const context = canvas.getContext('2d');

            for (const { contour, path } of this._layers) {
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

                const layerBounds = path.getBoundingBox();
                const { canvas: layerCanvas } = path.render(layerOptions);
                context.drawImage(layerCanvas, this.x + layerBounds.x - boundingBox.x, this.y + layerBounds.y - boundingBox.y);
            }

            return { canvas, context };
        }

        _addLayer(path, contour = false) {
            this._layers.push({
                contour,
                path
            });

            if (!contour) {
                const boundingBox = path.getBoundingBox();
                this._setBounds([boundingBox.left, boundingBox.right], [boundingBox.top, boundingBox.bottom]);
            }
        }

        _isContextBlank(context, width, height) {
            const data = context.getImageData(0, 0, width, height);
            const buffer = new Uint32Array(data.data.buffer);
            return buffer.every(value => !value);
        }

        _setBounds(xs, ys) {
            this._bounding.top = Math.min(this._bounding.top, ...ys);
            this._bounding.right = Math.max(this._bounding.right, ...xs);
            this._bounding.bottom = Math.max(this._bounding.bottom, ...ys);
            this._bounding.left = Math.min(this._bounding.left, ...xs);
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
            const mag = this.getMag();
            angle += this.getHeading();
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

        static _parse(x, y) {
            if (x instanceof Vector) {
                y = x.y;
                x = x.x;
            } else if (y === undefined) {
                y = x;
            }

            return { x, y };
        }

        static random() {
            return new this(Math.random(), Math.random());
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