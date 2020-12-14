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
