Object.assign(Canvas.prototype, {

    arc(x, y, radius, startAngle, endAngle) {
        this.begin();

        this._context.arc(x, y, radius, startAngle, endAngle);

        return this.end();
    },

    bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
        this.begin();

        this.vertex(x1, y1);
        this.bezierVertex(x2, y2, x3, y3, x4, y4);

        return this.end();
    },

    circle(x, y, diameter) {
        return this.ellipse(x, y, diameter, diameter);
    },

    curve(x1, y1, x2, y2, x3, y3, x4, y4) {
        this.begin();

        this.vertex(x1, y1);
        this.curveTo(x2, y2, x3, y3, x4, y4);

        return this.end();
    },

    ellipse(x, y, width, height, angle = 0) {
        this.begin();

        this._context.ellipse(x, y, width / 2, height / 2, angle, 0, Math.PI * 2);

        return this.end();
    },

    line(x1, y1, x2, y2) {
        this.begin();

        this.vertex(x1, y1);
        this.vertex(x2, y2);

        return this.end();
    },

    point(x, y) {
        this.begin();

        this.vertex(x, y);

        return this.end();
    },

    quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        this.begin();

        this.vertex(x1, y1);
        this.vertex(x2, y2);
        this.vertex(x3, y3);
        this.vertex(x4, y4);

        return this.end(true);
    },

    rect(x, y, width, height) {
        this.begin();

        this._context.rect(x, y, width, height);

        return this.end();
    },

    square(x, y, size) {
        return this.rect(x, y, size, size);
    },

    triangle(x1, y1, x2, y2, x3, y3) {
        this.begin();

        this.vertex(x1, y1);
        this.vertex(x2, y2);
        this.vertex(x3, y3);

        return this.end(true);
    }

});
