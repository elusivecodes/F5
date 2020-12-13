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

        constructor(node, width = 600, height = 400) {
            this._node = node;
            this._context = this._node.getContext('2d');

            this._states = [];

            this._fill = false;
            this._stroke = false;
            this._shadow = false;
            this._rectMode = false;
            this._ellipseMode = false;

            this.resize(width, height);
        }

        clear() {
            this._context.clearRect(0, 0, this._width, this._height);
        }

        composite(image) {
            const current = this.getImage(0, 0, this._width, this._height);

            current.data = current.data.map((pixel, i) => pixel + image.data[i]);

            this.putImage(current, 0, 0);
        }

        getImage(x, y, w, h) {
            return this._context.getImageData(x, y, w, h);
        }

        putImage(image, x, y, dx, dy, dw, dh) {
            if (arguments.length > 3) {
                this._context.putImageData(image, x, y, dx, dy, dw, dh);
            } else {
                this._context.putImageData(image, x, y);
            }
        }

        resize(w, h) {
            this._width = w;
            this._height = h;
            this._node.setAttribute('width', w);
            this._node.setAttribute('height', h);
        }

        restore() {
            const state = this._states.pop();
            Object.assign(this, state);
            this._context.restore();
        }

        save() {
            this._states.push({
                _fill: this._fill,
                _stroke: this._stroke,
                _shadow: this._shadow,
                _rectMode: this._rectMode,
                _ellipseMode: this._ellipseMode
            });
            this._context.save();
        }

    }


    Object.assign(Canvas.prototype, {

        fillColor(color) {
            this._fill = true;
            this._context.fillStyle = color;
        },

        noFill() {
            this._fill = false;
        },

        noShadow() {
            this._shadow = false;
        },

        noStroke() {
            this._stroke = false;
        },

        rotate(angle) {
            this._context.rotate(angle);
        },

        scale(width, height) {
            this._context.scale(width, height);
        },

        shadowBlur(amount) {
            this._context.shadowBlur = amount;
        },

        shadowColor(color) {
            this._shadow = true;
            this._context.shadowColor = color;
        },

        shadowOffset(x, y) {
            this._context.shadowOffsetX = x;
            this._context.shadowOffsetY = y;
        },

        strokeColor(color) {
            this._stroke = true;
            this._context.strokeStyle = color;
        },

        strokeWidth(width) {
            this._context.lineWidth = width;
        },

        translate(x, y) {
            this._context.translate(x, y);
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

        arc(x, y, r, a, b, m) {
            this._context.arc(x, y, r, a, b, m);
        },

        arcTo(x1, y1, x2, y2, r) {
            this._context.arcTo(x1, y1, x2, y2, r);
        },

        begin() {
            this._context.beginPath();
        },

        bezier(x1, y1, x2, y2, x3, y3) {
            this._context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
        },

        close() {
            this._context.closePath();
        },

        end() {
            if (this._fill) {
                this._context.fill();
            }

            if (this._stroke) {
                this._context.stroke();
            }
        },

        line(x, y) {
            this._context.lineTo(x, y);
        },

        move(x, y) {
            this._context.moveTo(x, y);
        },

        quadratic(x1, y1, x2, y2) {
            this._context.quadraticCurveTo(x1, y1, x2, y2);
        }

    });


    Object.assign(Canvas.prototype, {

        ellipse(x, y, radiusX, radiusY, angle = 0) {
            this.begin();
            this._context.ellipse(x, y, radiusX, radiusY, angle, 0, Math.PI * 2);
            this.end();
        },

        rect(x, y, width, height) {
            this.begin();
            this._context.rect(x, y, width, height);
            this.end();
        },

        square(x, y, size) {
            this.rect(x, y, size);
        }

    });


    Object.assign(Canvas.prototype, {

        align(aligment) {
            this._fontAlign = aligment;
        },

        fontSize(size) {
            this._fontSize = size;
        },

        font(font) {
            this._font = font;
        },

        fill(text, x, y) {
            this._context.font = this._fontSize + 'px ' + this._font;
            this._context.fillText(text, x, y);
        },

        stroke(text, x, y) {
            this._context.font = this._fontSize + 'px ' + this._font;
            this._context.strokeText(text, x, y);
        }

    });


    class F5 {

        constructor(node, width, height) {
            this.draw = new Canvas(node, width, height);

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


    class Vector {

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        add(other) {
            this.x += other.x;
            this.y += other.y;

            return this;
        }

        angleTo(other) {
            return other.getHeading() - this.getHeading();
        };

        clone() {
            return new this.constructor(this.x, this.y);
        }

        distTo(other) {
            return Math.hypot(other.x - this.x, other.y - this.y);
        }

        dot(other) {
            this.x *= other.y;
            this.y *= other.x;

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

        sub(other) {
            this.x -= other.x;
            this.y -= other.y;

            return this;
        }

        static random() {
            return new this(Math.random(), Math.random());
        }

    }

    F5.Canvas = Canvas;
    F5.Vector = Vector;

    return {
        F5
    };
});