class F5 {

    constructor(node, width, height) {
        this._node = node;
        this._loop = true;

        this.canvas = new Canvas(this._node, width, height);
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
    }

    setup() { }

    update() { }

}
