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
