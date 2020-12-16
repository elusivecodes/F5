Object.assign(Canvas.prototype, {

    begin() {
        this._context.beginPath();
        this._hasVertex = false;
    },

    bezierVertex(cx1, cy1, cx2, cy2, x, y) {
        this._context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    },

    curveVertex(x1, y1, x2, y2, radius) {
        this._context.arcTo(x1, y1, x2, y2, radius);
    },

    end(close = false) {
        if (close) {
            this._context.closePath();
        }

        if (this._settings.fill) {
            this._context.fill();
        }

        if (this._settings.stroke) {
            this._context.stroke();
        }
    },

    quadraticVertex(cx, cy, x, y) {
        this._context.quadraticCurveTo(cx, cy, x, y);
    },

    vertex(x, y) {
        if (!this._hasVertex) {
            this._context.moveTo(x, y);
            this._hasVertex = true;
        } else {
            this._context.lineTo(x, y);
        }
    }

});
