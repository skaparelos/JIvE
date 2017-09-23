class Renderer {

    constructor(canvas) {
        this.canvas = canvas;

        // items must be added here in the order to be rendered
        // items are rendered in the order they are in the list
        this.renderers = [];
    }

    clearScreen(ctx) {
        ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    }

    draw() {
        this.clearScreen(this.canvas.getCtx());
        this.renderers.forEach(function (renderer) {
            renderer.draw();
        });
    }

    append(renderer) {
        this.renderers.push(renderer);
    }

    addAt(renderer, position) {
        this.renderers.splice(position, 0, renderer);
    }
}