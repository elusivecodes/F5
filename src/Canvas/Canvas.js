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
