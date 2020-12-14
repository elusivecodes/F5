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

        constructor(f5, width = 600, height = 400) {
            this._f5 = f5;
            this._node = this._f5._node;
            this._context = this._f5._node.getContext('2d');

            this._states = [];

            this._fill = false;
            this._stroke = false;
            this._shadow = false;

            this._font = 'sans-serif';
            this._fontSize = 10;
            this._fontWeight = null;

            this._rectMode = false;
            this._ellipseMode = false;

            this.resize(width, height);
        }

        composite(image) {
            const current = this.getImage(0, 0, this.width, this.height);

            current.data = current.data.map((pixel, i) => pixel + image.data[i]);

            this.putImage(current, 0, 0);
        }

        getImage(x, y, w, h) {
            return this._context.getImageData(x, y, w, h);
        }

        pop() {
            const state = this._states.pop();
            Object.assign(this, state);
            this._context.restore();
        }

        push() {
            this._states.push({
                _fill: this._fill,
                _stroke: this._stroke,
                _shadow: this._shadow,
                _rectMode: this._rectMode,
                _ellipseMode: this._ellipseMode
            });
            this._context.save();
        }

        putImage(image, x, y, dx, dy, dw, dh) {
            if (arguments.length > 3) {
                this._context.putImageData(image, x, y, dx, dy, dw, dh);
            } else {
                this._context.putImageData(image, x, y);
            }
        }

        resize(w, h) {
            this.width = w;
            this.height = h;
            this._node.setAttribute('width', this.width);
            this._node.setAttribute('height', this.height);
        }

        rotate(angle) {
            this._context.rotate(angle);
        }

        scale(width, height) {
            this._context.scale(width, height);
        }

        translate(x, y) {
            this._context.translate(x, y);
        }

    }


    Object.assign(Canvas.prototype, {

        background(color) {
            this.fillColor(color);
            this.begin();
            this._context.rect(0, 0, this.width, this.height);
            this.end();
        },

        clear() {
            this._context.clearRect(0, 0, this.width, this.height);
        },

        fillColor(color) {
            this._fill = true;
            this._context.fillStyle = color;
        },

        noFill() {
            this._fill = false;
            this._context.fillStyle = '#000';
        },

        noShadow() {
            this._shadow = false;
            this._context.shadowColor = 'rgba(0,0,0,0)';
        },

        noStroke() {
            this._stroke = false;
            this._context.strokeStyle = '#000';
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

        arc(x, y, radius, startAngle, endAngle, antiClockwise) {
            this._context.arc(x, y, radius, startAngle, endAngle, antiClockwise);
        },

        arcTo(x1, y1, x2, y2, radius) {
            this._context.arcTo(x1, y1, x2, y2, radius);
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

        line(x1, y1, x2, y2) {
            this.begin();
            this._context.moveTo(x1, y1);
            this._context.lineTo(x2, y2);
            this.close();
            this.end();
        },

        move(x, y) {
            this._context.moveTo(x, y);
        },

        quadratic(x1, y1, x2, y2) {
            this._context.quadraticCurveTo(x1, y1, x2, y2);
        }

    });


    Object.assign(Canvas.prototype, {

        circle(x, y, radius) {
            return this.ellipse(x, y, radius, radius);
        },

        ellipse(x, y, radiusX, radiusY, angle = 0) {
            this.begin();
            this._context.ellipse(x, y, radiusX, radiusY, angle, 0, Math.PI * 2);
            this.close();
            this.end();
        },

        rect(x, y, width, height) {
            if (this._rectMode === 'CENTER') {
                x -= width / 2;
                y -= height / 2;
            }

            this.begin();
            this._context.rect(x, y, width, height);
            this.close();
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

            if (this._fontWeight) {
                font.push(this._fontWeight);
            }

            if (this._fontSize) {
                font.push(`${this._fontSize}px`);
            }

            font.push(this._font);

            this._context.font = font.join(' ');

            if (this._fill) {
                this._context.fillText(text, x, y);
            }

            if (this._stroke) {
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

            this._node.setAttribute('tabindex', '1');
            this._node.style.setProperty('outline', '0');
            this.draw = new Canvas(this, width, height);
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
    F5.Vector = Vector;

    return {
        F5
    };
});