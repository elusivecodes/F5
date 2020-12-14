Object.assign(Canvas.prototype, {

    circle(x, y, radius) {
        return this.ellipse(x, y, radius, radius);
    },

    ellipse(x, y, radiusX, radiusY, angle = 0) {
        this.begin();
        this._context.ellipse(x, y, radiusX, radiusY, angle, 0, Math.PI * 2);
        this.close();
        this.end();
    },

    rect(x, y, width, height) {
        if (this._rectMode === 'CENTER') {
            x -= width / 2;
            y -= height / 2;
        }

        this.begin();
        this._context.rect(x, y, width, height);
        this.close();
        this.end();
    },

    square(x, y, size) {
        this.rect(x, y, size, size);
    }

});
