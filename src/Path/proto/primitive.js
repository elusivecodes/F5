Object.assign(Path.prototype, {

    arc(x, y, radius, startAngle, endAngle) {
        this._path.arc(x, y, radius, startAngle, endAngle);
    },

    circle(x, y, diameter) {
        return this.ellipse(x, y, diameter, diameter);
    },

    ellipse(x, y, width, height, angle = 0) {
        this._path.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
    },

    line(x1, y1, x2, y2) {
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
    },

    rect(x, y, width, height) {
        this._path.rect(x, y, width, height);
    },

    square(x, y, size) {
        this.rect(x, y, size, size);
    }

});
