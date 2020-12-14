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
