class Canvas {

    constructor(node, width = 600, height = 400, settings) {
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

        return this;
    }

    background(color) {
        this.push();
        this.fillColor(color);
        this.rect(0, 0, this.width, this.height);
        this.pop();

        return this;
    }

    clear() {
        this._context.clearRect(0, 0, this.width, this.height);

        return this;
    }

    createShape(x = 0, y = 0, rotation = 0) {
        return new Shape(this._context, x, y, rotation);
    }

    createPath() {
        return new Path(this._context);
    }

    drawImage(image, x = 0, y = 0) {
        this._context.drawImage(image, x, y);

        return this;
    }

    drawPath(path, x = 0, y = 0) {
        const bounds = path.getBoundingBox();
        const { canvas } = path.render(this._settings);

        return this.drawImage(canvas, bounds.x + x, bounds.y + y);
    }

    drawShape(shape, x = 0, y = 0) {
        const bounds = shape.getBoundingBox();
        const { canvas } = shape.render(this._settings);

        return this.drawImage(canvas, bounds.x + x, bounds.y + y);
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

        return this;
    }

    getImage(x, y, w, h) {
        return this._context.getImageData(x, y, w, h);
    }

    pop() {
        this._settings = this._states.pop();
        this._context.restore();

        return this;
    }

    push() {
        this._states.push(this._settings);
        this._context.save();

        return this;
    }

    putImage(image, x, y, dx, dy, dw, dh) {
        if (arguments.length > 3) {
            this._context.putImageData(image, x, y, dx, dy, dw, dh);
        } else {
            this._context.putImageData(image, x, y);
        }

        return this;
    }

    reset() {
        this._settings = {
            fillStyle: null,
            font: 'sans-serif',
            fontSize: 10,
            fontWeight: null,
            lineWidth: 1,
            shadowBlur: 0,
            shadowColor: null,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            strokeStyle: '#000',
        };

        return this.resetMatrix();
    }

    resetMatrix() {
        this._context.resetTransform();

        return this;
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
        this._node.setAttribute('width', this.width);
        this._node.setAttribute('height', this.height);

        return this;
    }

    rotate(angle) {
        this._context.rotate(angle);

        return this;
    }

    scale(x, y = null) {
        if (y === undefined) {
            y = x;
        }

        this._context.scale(x, y);

        return this;
    }

    translate(x, y) {
        this._context.translate(x, y);

        return this;
    }

    static create(node, width = 600, height = 400, settings) {
        return new this(node, width, height, settings);
    }

}
