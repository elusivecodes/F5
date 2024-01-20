import CanvasContext from './../canvas-context/canvas-context.js';
import Vector from './../vector/vector.js';

/**
 * Canvas
 */
export default class Canvas {
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
