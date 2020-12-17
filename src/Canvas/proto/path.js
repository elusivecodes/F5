Object.assign(Canvas.prototype, {

    begin() {
        this._context.beginPath();
        this._hasVertex = false;

        return this;
    },

    bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);

        return this;
    },

    curveVertex(x1, y1, x2, y2, radius) {
        this._context.arcTo(x1, y1, x2, y2, radius);

        return this;
    },

    end(close = false) {
        if (close) {
            this._context.closePath();
        }

        this._draw();
    },

    quadraticVertex(cx, cy, x, y) {
        this._context.quadraticCurveTo(cx, cy, x, y);

        return this;
    },

    vertex(x, y) {
        if (!this._hasVertex) {
            this._context.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._context.lineTo(x, y);
        }

        return this;
    }

});
