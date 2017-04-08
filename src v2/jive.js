class Jive{

	constructor(fileURI){

		this.entities = []

		//this.canvas = new Canvas();
		//this.canvas.initFullScreen();

		this.imageLoader = new ImageLoader();
		this.tiledMap = new TiledMap();
		this.tiledMapRenderer = new TiledMapRenderer(this.tiledMap);

		var that = this;
		this.tiledMap.loadJSON(fileURI, this.imageLoader, function(){
			that._then = Date.now();
			that.reqAnimFrame();
		});

	}

	reqAnimFrame(){

		// reqAnimFrame is capped to 60FPS. In order to control FPS, we call
		// the drawing function every _period
    	requestAnimationFrame(this.reqAnimFrame.bind(this)) 

		var now = Date.now()
		this._deltaTime = now - this._then

		if (this._deltaTime >= 16) {

			this.update(this._deltaTime)
			this.draw()

        	this._then = now - (this._deltaTime % 16)
		} 
	}

	update(dt){

	}

	draw(){
		this.tiledMapRenderer.draw(this.imageLoader, Jive.canvas.getCtx());
	}


}

Jive.camera = null;
Jive.canvas = new Canvas();
