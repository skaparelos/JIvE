class Renderer{

	constructor(canvas){
		this.canvas = canvas || JIVE._canvas;
		this.mapRenderer = new TiledMapRenderer();
		this.entityRenderer = new EntityRenderer();
		this.selectorRenderer = new SelectorRenderer();
	}

	clearScreen(ctx){
		ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	}

	draw(camera, map, entities,  selector, imageLoader){
		var ctx = this.canvas.getCtx();
		this.clearScreen(ctx);
		imageLoader = imageLoader || JIVE._imageLoader;

		this.mapRenderer.draw(map, camera, ctx, imageLoader);
		this.entityRenderer.draw(entities, camera, ctx, imageLoader);
		if (selector != undefined && selector.isActive())
			this.selectorRenderer.draw(selector, ctx);
	}
}