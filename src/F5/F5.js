class F5 {

    constructor(node, width, height) {
        this._node = node;

        this._node.setAttribute('tabindex', '1');
        this._node.style.setProperty('outline', '0');
        this.draw = new Canvas(this, width, height);
        this.input = new Input(this);

        const start = Date.now();

        const run = _ => {
            window.requestAnimationFrame(_ => {
                const now = Date.now();
                const delta = (now - start) / 1000;
                this.update(delta);
                run();
            });
        };

        this.setup();

        run();
    }

    setup() { }

    update() { }

}
