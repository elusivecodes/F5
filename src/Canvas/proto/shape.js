Object.assign(Canvas.prototype, {

    ellipse(x, y, radiusX, radiusY, angle = 0) {
        this.begin();
        this._context.ellipse(x, y, radiusX, radiusY, angle, 0, Math.PI * 2);
        this.end();
    },

    rect(x, y, width, height) {
        this.begin();
        this._context.rect(x, y, width, height);
        this.end();
    },

    square(x, y, size) {
        this.rect(x, y, size);
    }

});
