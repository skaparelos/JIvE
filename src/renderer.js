class Renderer {

    constructor() {
    }

    init() {
        this.canvas = JIVE.Canvas;
        this.mapRenderer = new TiledMapRenderer();
        this.entityRenderer = new EntityRenderer();
        this.selectorRenderer = new SelectorRenderer();
    }

    clearScreen(ctx) {
        ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    }

    draw(camera, map, entities, selector, imageLoader = JIVE.ImageLoader) {
        var ctx = this.canvas.getCtx();
        this.clearScreen(ctx);

        this.mapRenderer.draw(map, camera, ctx, imageLoader);
        this.entityRenderer.draw(entities, camera, ctx, imageLoader);
        if (selector !== undefined && selector.isActive())
            this.selectorRenderer.draw(selector, ctx);
    }
}