Object.assign(Path.prototype, {

    arc(x, y, radius, startAngle, endAngle) {
        this._setBounds([x - radius, x + radius], [y - radius, y + radius]);
        this._path.arc(x, y, radius, startAngle, endAngle);
    },

    bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        this._path.moveTo(x1, y1);
        this._path.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    },

    circle(x, y, diameter) {
        this.ellipse(x, y, diameter, diameter);
    },

    curve(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        this._path.moveTo(x1, y1);
        this._path.arcTo(x2, y2, x3, y3, x4, y4);
    },

    ellipse(x, y, width, height, angle = 0) {
        const xRadius = width / 2;
        const yRadius = height / 2;
        this._setBounds([x - xRadius, x + xRadius], [y - yRadius, y + yRadius]);
        this._path.ellipse(x, y, xRadius, yRadius, angle, 0, Math.PI * 2);
    },

    line(x1, y1, x2, y2) {
        this._setBounds([x1, x2], [y1, y2]);
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
    },

    quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._setBounds([x1, x2, x3, x4], [y1, y2, y3, y4]);
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.lineTo(x4, y4);
        this._path.closePath();
    },

    rect(x, y, width, height) {
        this._setBounds([x, x + width], [y, y + height]);
        this._path.rect(x, y, width, height);
    },

    square(x, y, size) {
        this.rect(x, y, size, size);
    },

    triangle(x1, y1, x2, y2, x3, y3) {
        this._setBounds([x1, x2, x3], [y1, y2, y3]);
        this._path.moveTo(x1, y1);
        this._path.lineTo(x2, y2);
        this._path.lineTo(x3, y3);
        this._path.closePath();
    }

});
