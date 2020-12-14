class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(...args) {
        const { x, y } = this.constructor._parse(...args);
        this.x += x;
        this.y += y;

        return this;
    }

    angleTo(...args) {
        const { x, y } = this.constructor._parse(...args);
        return Math.atan2(y, x) - this.getHeading();
    };

    clone() {
        return new this.constructor(this.x, this.y);
    }

    distTo(...args) {
        const { x, y } = this.constructor._parse(...args);
        return Math.hypot(x - this.x, y - this.y);
    }

    dot(...args) {
        const { x, y } = this.constructor._parse(...args);
        this.x *= y;
        this.y *= x;

        return this;
    }

    getHeading() {
        return Math.atan2(this.y, this.x);
    }

    getMag() {
        return Math.hypot(this.x, this.y);
    }

    limit(limit) {
        if (this.getMag() > limit) {
            return this.setMag(limit);
        }

        return this;
    }

    mult(...args) {
        const { x, y } = this.constructor._parse(...args);
        this.x *= x;
        this.y *= y;

        return this;
    }

    normalize() {
        return this.setMag(1);
    }

    rotate(angle) {
        const mag = this.getMag();
        angle += this.getHeading();
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;

        return this;
    }

    setHeading(angle) {
        const mag = this.getMag();
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;

        return this;
    }

    setMag(mag) {
        const angle = this.getHeading();
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;

        return this;
    }

    sub(...args) {
        const { x, y } = this.constructor._parse(...args);
        this.x -= x;
        this.y -= y;

        return this;
    }

    static _parse(x, y) {
        if (x instanceof Vector) {
            y = x.y;
            x = x.x;
        } else if (y === undefined) {
            y = x;
        }

        return { x, y };
    }

    static random() {
        return new this(Math.random(), Math.random());
    }

}
