var JIVE = {};

JIVE.Map = function () {
	return new TiledMap();
};

JIVE.Renderer = function (map){
	return new TiledMapRenderer(map);
};

JIVE.ImageLoader = function (){
	return new ImageLoader();
};

JIVE.Canvas = function (){
	return new Canvas();
};

/*
class Jive{

	constructor(fileURI){

		this.entities = []

		// the imageLoader is used to load the images needed.
		this.imageLoader = new ImageLoader();

		this.tiledMap = new TiledMap();
		this.tiledMapRenderer = new TiledMapRenderer(this.tiledMap);

		this.tiledMap.loadJSON(fileURI, this.imageLoader, function(){});
	}


	Map(){
		return new TiledMap();
	}

	Renderer(map){
		return new TiledMapRenderer(map)
	}

	update(dt){

	}

	draw(){
		if ( !this.tiledMap.isLoaded() ) return;
		this.tiledMapRenderer.draw(this.imageLoader, Jive.canvas.getCtx());
	}


}

Jive.camera = null;
Jive.canvas = new Canvas();
*/
