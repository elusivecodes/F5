Object.assign(Canvas.prototype, {

    arc(x, y, radius, startAngle, endAngle) {
        this._context.beginPath();
        this._context.arc(x, y, radius, startAngle, endAngle);
        this.end();
    },

    bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
        this.end();
    },

    circle(x, y, diameter) {
        this.ellipse(x, y, diameter, diameter);
    },

    curve(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.arcTo(x2, y2, x3, y3, x4, y4);
        this.end();
    },

    ellipse(x, y, width, height, angle = 0) {
        this._context.beginPath();
        this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);
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

    quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.lineTo(x3, y3);
        this._context.lineTo(x4, y4);
        this.end(true);
    },

    rect(x, y, width, height) {
        this._context.beginPath();
        this._context.rect(x, y, width, height);
        this.end();
    },

    square(x, y, size) {
        this.rect(x, y, size, size);
    },

    triangle(x1, y1, x2, y2, x3, y3) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.lineTo(x3, y3);
        this.end(true);
    }

});
