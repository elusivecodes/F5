class Canvas {

    constructor(node, width = 600, height = 400, settings) {
        this._node = node;
        this._context = this._node.getContext('2d');

        this._settings = {
            fill: false,
            stroke: false,
            shadow: false,
            font: 'sans-serif',
            fontSize: 10,
            fontWeight: null,
            rectMode: null,
            ellipseMode: null,
            ...settings
        };

        this._states = [];
        this._hasPath = false;

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

    createPath(x = 0, y = 0) {
        return new Path(this._context, x, y, this.width, this.height);
    }

    // createShape(callback) {
    //     const canvas = document.createElement('canvas');
    //     const draw = new this.constructor(canvas, this.width, this.height, this._settings);
    //     draw._context.fillStyle = this._context.fillStyle;
    //     draw._context.font = this._context.font;
    //     draw._context.lineWidth = this._context.lineWidth;
    //     draw._context.shadowBlur = this._context.shadowBlur;
    //     draw._context.shadowColor = this._context.shadowColor;
    //     draw._context.shadowOffsetX = this._context.shadowOffsetX;
    //     draw._context.shadowOffsetY = this._context.shadowOffsetY;
    //     draw._context.strokeStyle = this._context.strokeStyle;
    //     draw._context.textAlign = this._context.textAlign;
    //     callback(draw);
    //     this.drawImage(canvas, 0, 0);
    // }

    drawImage(image, x, y) {
        this._context.drawImage(image, x, y);
    }

    drawPath(path) {
        const image = path.buildImage({
            fillStyle: this._context.fillStyle,
            lineWidth: this._context.lineWidth,
            strokeStyle: this._context.strokeStyle
        });
        this.drawImage(image, 0, 0);
    }

    erase(callback) {
        this.push();
        this.reset();
        this.fillColor('black');
        this._context.globalCompositeOperation = 'destination-out';
        callback();
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
        this._path = [];

        this._fill = false;
        this._stroke = false;
        this._shadow = false;

        this._font = 'sans-serif';
        this._fontSize = 10;
        this._fontWeight = null;

        this._rectMode = false;

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

    scale(width, height) {
        this._context.scale(width, height);
    }

    translate(x, y) {
        this._context.translate(x, y);
    }

}
