class Canvas {

    constructor(node, width = 600, height = 400, settings = {}) {
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

    createShape() {
        return new Shape(this._context);
    }

    createPath() {
        return new Path(this._context);
    }

    drawImage(image, x = 0, y = 0) {
        this._context.drawImage(image, x, y);
    }

    drawPath(path, x = 0, y = 0) {
        const boundingBox = path.getBoundingBox();
        const { canvas } = path.render({
            fillStyle: this._context.fillStyle,
            lineWidth: this._context.lineWidth,
            strokeStyle: this._context.strokeStyle
        });
        this.drawImage(canvas, boundingBox.x + x, boundingBox.y + y);
    }

    drawShape(shape, x = 0, y = 0) {
        const boundingBox = shape.getBoundingBox();
        const { canvas } = shape.render({
            fillStyle: this._context.fillStyle,
            lineWidth: this._context.lineWidth,
            strokeStyle: this._context.strokeStyle
        });
        this.drawImage(canvas, boundingBox.x + x, boundingBox.y + y);
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
        this._settings = {
            fill: false,
            stroke: false,
            shadow: false,
            font: 'sans-serif',
            fontSize: 10,
            fontWeight: null
        };

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

    scale(x, y = null) {
        if (y === undefined) {
            y = x;
        }

        this._context.scale(x, y);
    }

    translate(x, y) {
        this._context.translate(x, y);
    }

}
