class Path {

    constructor(context, x, y, width, height) {
        this._context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._path = new Path2D();
        this._hasVertex = false;
        this._contours = [];
    }

    add(path) {
        this._path.addPath(path);
    }

    bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    }

    buildImage(options) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);

        const context = canvas.getContext('2d');
        Object.assign(context, options);

        context.translate(this.x, this.y);
        context.fill(this._path);
        context.translate(-this.x, -this.y);

        context.globalCompositeOperation = 'destination-out';
        for (const contour of this._contours) {
            const contourImage = contour.buildImage({
                fillStyle: '#000'
            });
            context.drawImage(contourImage, 0, 0);
        }

        return canvas;
    }

    close() {
        this._path.closePath();
    }

    containsPoint(x, y) {
        if (this._contours.some(contour => contour.containsPoint(x, y))) {
            return false;
        }

        return this._context.isPointInPath(this._path, x, y);
    }

    createContour(x = 0, y = 0) {
        const path = new Path(this._context, this.x + x, this.y + y, this.width, this.height);
        this._contours.push(path);
        return path;
    }

    curveVertex(x1, y1, x2, y2, radius) {
        this._path.arcTo(x1, y1, x2, y2, radius);
    }

    quadraticVertex(cx, cy, x, y) {
        this._path.quadraticCurveTo(cx, cy, x, y);
    }

    vertex(x, y) {
        if (!this._hasVertex) {
            this._path.moveTo(x, y);
        } else {
            this._path.lineTo(x, y);
            this._hasVertex = true;
        }
    }

    contains(path) {
        if (this._contours.some(contour => contour.intersects(path))) {
            return false;
        }

        const pathPixels = path._getPixels();
        const overlapPixels = this._getOverlap(path);

        return pathPixels.every((pixel, i) => !!pixel == !!overlapPixels[i]);
    }

    intersects(path) {
        if (this._contours.some(contour => contour.contains(path))) {
            return false;
        }

        return this._getOverlap(path).some(pixel => pixel);
    }

    _getPixels() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);

        const context = canvas.getContext('2d');
        context.translate(this.x, this.y);
        context.fill(this._path);

        const data = context.getImageData(0, 0, this.width, this.height);
        return new Uint32Array(data.data.buffer);
    }

    _getOverlap(path) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);

        const context = canvas.getContext('2d');
        context.translate(this.x, this.y);
        context.clip(this._path);
        context.translate(-this.x, -this.y);
        context.translate(path.x, path.y);
        context.fill(path._path);

        const data = context.getImageData(0, 0, this.width, this.height);
        return new Uint32Array(data.data.buffer);
    }

}
