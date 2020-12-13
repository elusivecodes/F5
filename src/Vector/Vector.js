class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    angleTo(other) {
        return other.getHeading() - this.getHeading();
    };

    clone() {
        return new this.constructor(this.x, this.y);
    }

    distTo(other) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    }

    dot(other) {
        this.x *= other.y;
        this.y *= other.x;

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

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    }

    static random() {
        return new this(Math.random(), Math.random());
    }

}
