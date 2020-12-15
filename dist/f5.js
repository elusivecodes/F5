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

            this._settings = {
                fill: false,
                stroke: false,
                shadow: false,
                font: 'sans-serif',
                fontSize: 10,
                fontWeight: null,
                rectMode: null,
                ellipseMode: null,
                ...settings
            };

            this._states = [];
            this._hasPath = false;

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

        createPath(x = 0, y = 0) {
            return new Path(this._context, x, y, this.width, this.height);
        }

        // createShape(callback) {
        //     const canvas = document.createElement('canvas');
        //     const draw = new this.constructor(canvas, this.width, this.height, this._settings);
        //     draw._context.fillStyle = this._context.fillStyle;
        //     draw._context.font = this._context.font;
        //     draw._context.lineWidth = this._context.lineWidth;
        //     draw._context.shadowBlur = this._context.shadowBlur;
        //     draw._context.shadowColor = this._context.shadowColor;
        //     draw._context.shadowOffsetX = this._context.shadowOffsetX;
        //     draw._context.shadowOffsetY = this._context.shadowOffsetY;
        //     draw._context.strokeStyle = this._context.strokeStyle;
        //     draw._context.textAlign = this._context.textAlign;
        //     callback(draw);
        //     this.drawImage(canvas, 0, 0);
        // }

        drawImage(image, x, y) {
            this._context.drawImage(image, x, y);
        }

        drawPath(path) {
            const image = path.buildImage({
                fillStyle: this._context.fillStyle,
                lineWidth: this._context.lineWidth,
                strokeStyle: this._context.strokeStyle
            });
            this.drawImage(image, 0, 0);
        }

        erase(callback) {
            this.push();
            this.reset();
            this.fillColor('black');
            this._context.globalCompositeOperation = 'destination-out';
            callback();
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
            this._path = [];

            this._fill = false;
            this._stroke = false;
            this._shadow = false;

            this._font = 'sans-serif';
            this._fontSize = 10;
            this._fontWeight = null;

            this._rectMode = false;

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

        scale(width, height) {
            this._context.scale(width, height);
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
            this._settings.shadow = true;
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
            this._hasPath = false;
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
            if (!this._hasPath) {
                this._context.moveTo(x, y);
            } else {
                this._context.lineTo(x, y);
                this._hasPath = true;
            }
        }

    });


    Object.assign(Canvas.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this._context.beginPath();
            this._context.arc(x, y, radius, startAngle, endAngle);
            this._context.closePath();
            this.end();
        },

        circle(x, y, diameter) {
            return this.ellipse(x, y, diameter, diameter);
        },

        ellipse(x, y, width, height, angle = 0) {
            this._context.beginPath();
            this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
            this._context.closePath();
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

        rect(x, y, width, height) {
            if (this._rectMode === 'CENTER') {
                x -= width / 2;
                y -= height / 2;
            }

            this._context.beginPath();
            this._context.rect(x, y, width, height);
            this._context.closePath();
            this.end();
        },

        square(x, y, size) {
            this.rect(x, y, size, size);
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

            this.canvas = new Canvas(this._node, width, height);
            this.input = new Input(this);

            const start = Date.now();

            const run = _ => {
                window.requestAnimationFrame(_ => {
                    const now = Date.now();
                    const delta = (now - start) / 1000;
                    this.update(delta);
                    run();
                });
            };

            this.setup();

            run();
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

        constructor(context, x, y, width, height) {
            this._context = context;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            this._path = new Path2D();
            this._hasVertex = false;
            this._contours = [];
        }

        add(path) {
            this._path.addPath(path);
        }

        bezierVertex(cx1, cy1, cx2, cy2, x, y) {
            this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
        }

        buildImage(options) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', this.width);
            canvas.setAttribute('height', this.height);

            const context = canvas.getContext('2d');
            Object.assign(context, options);

            context.translate(this.x, this.y);
            context.fill(this._path);
            context.translate(-this.x, -this.y);

            context.globalCompositeOperation = 'destination-out';
            for (const contour of this._contours) {
                const contourImage = contour.buildImage({
                    fillStyle: '#000'
                });
                context.drawImage(contourImage, 0, 0);
            }

            return canvas;
        }

        close() {
            this._path.closePath();
        }

        containsPoint(x, y) {
            if (this._contours.some(contour => contour.containsPoint(x, y))) {
                return false;
            }

            return this._context.isPointInPath(this._path, x, y);
        }

        createContour(x = 0, y = 0) {
            const path = new Path(this._context, this.x + x, this.y + y, this.width, this.height);
            this._contours.push(path);
            return path;
        }

        curveVertex(x1, y1, x2, y2, radius) {
            this._path.arcTo(x1, y1, x2, y2, radius);
        }

        quadraticVertex(cx, cy, x, y) {
            this._path.quadraticCurveTo(cx, cy, x, y);
        }

        vertex(x, y) {
            if (!this._hasVertex) {
                this._path.moveTo(x, y);
            } else {
                this._path.lineTo(x, y);
                this._hasVertex = true;
            }
        }

        contains(path) {
            if (this._contours.some(contour => contour.intersects(path))) {
                return false;
            }

            const pathPixels = path._getPixels();
            const overlapPixels = this._getOverlap(path);

            return pathPixels.every((pixel, i) => !!pixel == !!overlapPixels[i]);
        }

        intersects(path) {
            if (this._contours.some(contour => contour.contains(path))) {
                return false;
            }

            return this._getOverlap(path).some(pixel => pixel);
        }

        _getPixels() {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', this.width);
            canvas.setAttribute('height', this.height);

            const context = canvas.getContext('2d');
            context.translate(this.x, this.y);
            context.fill(this._path);

            const data = context.getImageData(0, 0, this.width, this.height);
            return new Uint32Array(data.data.buffer);
        }

        _getOverlap(path) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('width', this.width);
            canvas.setAttribute('height', this.height);

            const context = canvas.getContext('2d');
            context.translate(this.x, this.y);
            context.clip(this._path);
            context.translate(-this.x, -this.y);
            context.translate(path.x, path.y);
            context.fill(path._path);

            const data = context.getImageData(0, 0, this.width, this.height);
            return new Uint32Array(data.data.buffer);
        }

    }


    Object.assign(Path.prototype, {

        arc(x, y, radius, startAngle, endAngle) {
            this._path.arc(x, y, radius, startAngle, endAngle);
        },

        circle(x, y, diameter) {
            return this.ellipse(x, y, diameter, diameter);
        },

        ellipse(x, y, width, height, angle = 0) {
            this._path.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
        },

        line(x1, y1, x2, y2) {
            this._path.moveTo(x1, y1);
            this._path.lineTo(x2, y2);
        },

        rect(x, y, width, height) {
            this._path.rect(x, y, width, height);
        },

        square(x, y, size) {
            this.rect(x, y, size, size);
        }

    });


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
    F5.Vector = Vector;

    return {
        F5
    };
});