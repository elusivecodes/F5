class F5 {

    constructor(node, width = 600, height = 400) {
        this._node = node;
        this._loop = true;

        this.canvas = Canvas.create(this._node, width, height);
        this.input = new Input(this);

        const start = Date.now();

        const run = _ => {
            const now = Date.now();
            const delta = (now - start) / 1000;

            this.update(delta);

            if (this._loop) {
                window.requestAnimationFrame(_ => {
                    run();
                });
            }
        };

        this.setup();

        run();
    }

    noLoop() {
        this._loop = false;

        return this;
    }

    setup() { }

    update() { }

    static create(node, width = 600, height = 400) {
        return new this(node, width, height);
    }

    static createCanvas(parent = document.body, width = 600, height = 400) {
        const canvas = document.createElement('canvas');

        parent.append(canvas);

        return new this(canvas, width, height);
    }

}
