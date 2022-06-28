/**
 * Canvas
 */
class Canvas {

    /**
     * New Canvas constructor.
     * @param {HTMLCanvasElement} node The canvas node.
     * @param {number} [width=600] The canvas width.
     * @param {number} [height=400] The canvas height.
     * @returns {Canvas} A new Canvas object.
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

        const run = _ => {
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
     * @returns {Boolean} TRUE if the key is being pressed, otherwise FALSE.
     */
    isKeyPressed(code) {
        return code ?
            code in this._keysDown :
            Object.keys(this._keysDown).length;
    }

    /**
     * Determine if a mouse button is being pressed.
     * @param {number} button The mouse button.
     * @returns {Boolean} TRUE if the mouse button is being pressed, otherwise FALSE.
     */
    isMousePressed(button = 0) {
        return button in this._mouseDown && this._mouseX !== null && this._mouseY !== null;
    }

    /**
     * Get the mouse position.
     * @returns {Vector|null} The mouse position.
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
     * @param {string} code The key code.
     * @param {KeyboardEvent} event The event.
     */
    onKeyDown(code, event) {

    }

    /**
     * Key press callback.
     * @param {string} code The key code.
     * @param {KeyboardEvent} event The event.
     */
    onKeyPress(code, event) {

    }

    /**
     * Key up callback.
     * @param {string} code The key code.
     * @param {KeyboardEvent} event The event.
     */
    onKeyUp(code, event) {

    }

    /**
     * Mouse click callback.
     * @param {number} button The mouse button.
     * @param {MouseEvent} event The event.
     */
    onMouseClick(button, event) {

    }

    /**
     * Mouse down callback.
     * @param {number} button The mouse button.
     * @param {MouseEvent} event The event.
     */
    onMouseDown(button, event) {

    }

    /**
     * Mouse enter callback.
     * @param {MouseEvent} event The event.
     */
    onMouseEnter(event) {

    }

    /**
     * Mouse leave callback.
     * @param {MouseEvent} event The event.
     */
    onMouseLeave(event) {

    }

    /**
     * Mouse move callback.
     * @param {number} x The X position.
     * @param {number} y The Y position.
     * @param {MouseEvent} event The event.
     */
    onMouseMove(x, y, event) {

    }

    /**
     * Mouse up callback.
     * @param {number} button The mouse button.
     * @param {MouseEvent} event The event.
     */
    onMouseUp(button, event) {

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
        const updateMouse = e => {
            this._mouseX = e.offsetX;
            this._mouseY = e.offsetY;
        };

        this._node.addEventListener('mouseenter', e => {
            updateMouse(e);

            this.onMouseEnter(e);
        });

        this._node.addEventListener('mouseleave', e => {
            updateMouse(e);

            this.onMouseLeave(e);

            this._mouseX = null;
            this._mouseY = null;
        });

        this._node.addEventListener('mousemove', e => {
            updateMouse(e);

            this.onMouseMove(this._mouseX, this._mouseY, e);
        });

        this._node.addEventListener('mousedown', e => {
            this._mouseDown[e.button] = true;

            updateMouse(e);

            this.onMouseDown(e.button, e);

            window.addEventListener('mouseup', e => {
                delete this._mouseDown[e.button];

                updateMouse(e);

                this.onMouseUp(e.button, e);
            }, {
                once: true
            });
        });

        this._node.addEventListener('click', e => {
            updateMouse(e);

            this.onMouseClick(e.button, e);
        });

        this._node.addEventListener('keydown', e => {
            this._keysDown[e.code] = true;

            this.onKeyDown(e.code, e);

            window.addEventListener('keyup', e => {
                delete this._keysDown[e.code];

                this.onKeyUp(e.code, e);
            }, {
                once: true
            });
        });

        this._node.addEventListener('keypress', e => {
            this.onKeyPress(e.code, e);
        });
    }

    /**
     * Create a new Canvas with a new canvas element.
     * @param {HTMLCanvasElement} [parent] The parent node.
     * @param {number} [width=600] The canvas width.
     * @param {number} [height=400] The canvas height.
     * @returns {Canvas} A new Canvas object.
     */
    static attach(parent = document.body, width = 600, height = 400) {
        const canvas = document.createElement('canvas');

        parent.append(canvas);

        return new this(canvas, width, height);
    }

}
