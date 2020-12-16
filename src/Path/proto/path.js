Object.assign(Path.prototype, {

    bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._setBounds([cx1, cx2, x], [cy1, cy2, y]);
        this._path.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    },

    close() {
        this._path.closePath();
    },

    curveVertex(x1, y1, x2, y2, radius) {
        this._setBounds([x1, x2], [y1, y2]);
        this._path.arcTo(x1, y1, x2, y2, radius);
    },

    quadraticVertex(cx, cy, x, y) {
        this._setBounds([cx, x], [cy, y]);
        this._path.quadraticCurveTo(cx, cy, x, y);
    },

    vertex(x, y) {
        this._setBounds([x], [y]);

        if (!this._hasVertex) {
            this._path.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._path.lineTo(x, y);
        }
    }

});
