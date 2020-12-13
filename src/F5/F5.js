class F5 {

    constructor(node, width, height) {
        this.draw = new Canvas(node, width, height);

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
