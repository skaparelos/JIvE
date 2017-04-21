class TiledMap{

	constructor(){

		// Holds the map data and the layers.
		// this variable has 3 dimensions.
		// one is to access the layer and the rest
		// are to access a 2d position
		this.map = [];

		this.layersNo = 0;

		// the unit tile height (i.e. smallest possible height of a tile)
		this.tileHeight = 0;

		// the unit tile width (i.e. smallest possible width of a tile)
		this.tileWidth = 0;

		// the width of the map in number of tiles
		this.mapWidth = 0;

		// the height of the map in number of tiles
		this.mapHeight = 0;

		// holds the relation
		// {"gid": [imageName, x, y, w, h]}
		this.gid2ImagePos = {};

		// indicates whether a tiled map has been loaded or not.
		this.loaded = false;

		return this;

	}

	/**
	* loadJSON takes a JSON exported from tiled and loads the map.
	* @param JsonURI string
	* @param callback function
	* @param imageLoader instance of imageLoader class
	*/ 
	loadJSON(JsonURI, callback, imageLoader){
		imageLoader = imageLoader || JIVE._imageLoader;
		var that = this;

		Utils.xhrGet(JsonURI, function(data){
			that.parseMap(data.responseText);
			that.loadImages(data.responseText, callback, imageLoader)
			that.loaded = true;
		})
	}


	isLoaded(){
		return this.loaded;
	}


	getGID(gid){
		return this.gid2ImagePos[gid];
	}


	getMap(){
		return {
			"map": this.map, 
			"layersNo": this.layersNo,
			"mapwidth": this.mapWidth,
			"mapheight": this.mapHeight,
			"tilewidth": this.tileWidth,
			"tileheight": this.tileHeight
		}
	}


	setTile(layer, row, col, gidValue){
		this.map[layer][row][col] = gidValue;
		return this;
	}


	getTileWidth(){ 
		return this.tileWidth; 
	}


	getTileHeight(){ 
		return this.tileHeight; 
	}


	loadImages(data, callback, imageLoader){
		var jsonData = JSON.parse(data);
		var tilesets = jsonData["tilesets"];
		var imgsList = [];
		for (var ts = 0; ts < tilesets.length; ts++){
			imgsList.push(tilesets[ts]["image"]);
		}

		// load the images
		imageLoader.loadImages(imgsList, callback);
	}

	parseMap(data){
		var jsonData = JSON.parse(data);
		var layers = jsonData["layers"];
		var tileSets = jsonData["tilesets"];
		this.layersNo = layers.length;
		this.tileWidth = jsonData["tilewidth"];
		this.tileHeight = jsonData["tileheight"];
		this.mapWidth = jsonData["width"];
		this.mapHeight = jsonData["height"];


		// create the map as a 2d array so that it is easier to 
		// manipulate it later. For each layer go through the 
		// the data on that layer and create the map.
		var map2d = [], ctr = 0;
		for(var layer = 0; layer < layers.length; layer++){

			for(var i = 0; i < this.mapHeight; i++){
				map2d[i] = [];

				for(var j = 0; j < this.mapWidth; j++){
					map2d[i][j] = layers[layer]["data"][ctr];
					ctr++;
				}
			}
			
			this.map.push(map2d);
			map2d = [];
			ctr = 0;
		}


		// create a mapping between GIDs and the position of the atlas frame
		// in the atlas image. 
		// build the {"gid": [imageName, x, y, w, h]}
		var gid = 1;
		for (var tileset = 0; tileset < tileSets.length; tileset++){

			var imageName = tileSets[tileset]["image"];
			var imageHeight = tileSets[tileset]["imageheight"];
			var heightStep = tileSets[tileset]["tileheight"];
			for(var h = 0; h < imageHeight; h += heightStep){

				var imageWidth = tileSets[tileset]["imagewidth"];
				var widthStep = tileSets[tileset]["tilewidth"];
				for (var w = 0; w < imageWidth; w += widthStep){

					this.gid2ImagePos[gid] = {"imagename":imageName, 
						"x":w, "y":h, "w":widthStep, "h":heightStep};
					gid++;
				}
			}
		}
	}
}