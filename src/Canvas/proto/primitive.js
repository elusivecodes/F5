Object.assign(Canvas.prototype, {

    arc(x, y, radius, startAngle, endAngle) {
        this._context.beginPath();
        this._context.arc(x, y, radius, startAngle, endAngle);
        this._context.closePath();
        this.end();
    },

    circle(x, y, diameter) {
        return this.ellipse(x, y, diameter, diameter);
    },

    ellipse(x, y, width, height, angle = 0) {
        this._context.beginPath();
        this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
        this._context.closePath();
        this.end();
    },

    line(x1, y1, x2, y2) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.stroke();
    },

    point(x, y) {
        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.stroke();
    },

    rect(x, y, width, height) {
        if (this._rectMode === 'CENTER') {
            x -= width / 2;
            y -= height / 2;
        }

        this._context.beginPath();
        this._context.rect(x, y, width, height);
        this._context.closePath();
        this.end();
    },

    square(x, y, size) {
        this.rect(x, y, size, size);
    }

});
