/**
 *
 */
class Map{

	constructor(){
		this._width = 0;
		this._height = 0;
        this._layerCtr = 0;

        // this is a 3D array.
		// [i][j][k]
		// i -> is the layer index
		// j -> is the row index
		// k -> is the column index
        this._map = [];
	}


	load(){

		// load worldObjects here and then the map. This is to ensure that they
		// happen in order and that the map is not loaded before the worldObjects
		WorldObject.load(g_worldObjects);

		// now load the map
		var mapJSONed = JSON.parse(g_mapLevels);
		
		this._height = mapJSONed["_height"];
		this._width = mapJSONed["_width"];
		this._layerCtr = mapJSONed["_layerCtr"];

		if (this._width !== this._height)
			console.log("ERROR! height does not match width!");

		for (var mapLayer = 0; mapLayer < this._layerCtr; mapLayer++) {

            // create empty map layer
            var layer = new MapLayer();
            layer.createEmptyLayer(this._width, this._height);

			// first "_map" is to access this the Map._map.
			// second one is to access MapLayer._map
			var map = mapJSONed["_map"][mapLayer]["_map"];

            for (var row = 0; row < this._height; row++) {
                for (var col = 0; col < this._width; col++) {
                    var c = map[row][col];
                    layer.setCell(row, col, c["_type"], c["_worldObjectId"])
                }
            }

            this.addLayer(layer);
        }

	}


	addLayer(mapLayer){
		this._map.push(mapLayer);
		this._layerCtr += 1;

		// width and height should be the same for each layer
        // however, we update the width and height everytime since we do not
        // know the total number of layers in advance
		// we could have used a singleton instead
		this._width = mapLayer.getLayerMap()[0].length;
		this._height = mapLayer.getLayerMap().length;
		console.log('map width = ' + this._width + ' height = ' + this._height);

		// Set maximum scroll based on the map size
		// TODO add this in camera.js
		//this._maxChangeX = (this._width * (g_unit_tile_width / 2))
		//this._maxChangeY = (this._height * (g_unit_tile_height / 2)) / 2
	}


	/**
	 * Translates screen coordinates to map coordinates
	 * Runs in O(1).
	 *
	 * @param e A click event.
	 *
	 * Outputs the cell in the map that was clicked
	*/
	screen2MapCoords(e, camera) {

		/*  Solve the drawing functions for tileX, tileY
			These are the 2 drawing equations:
			screenX = (tileX - tileY) * unittileWidth / zoomLevel / 2 + camX;
			screenY = (tileY + tileX) * unittileHeight / zoomLevel / 2 + camY;
		*/

		var mapWidth = this._width;
		var mapHeight = this._height;

		var cam = camera.getCamera();
		var camX = cam.x;
		var camY = cam.y;
		var zoomLevel = cam.zoomLevel;

		var clientX = e.clientX - cam.canvasOffsetLeft;
		var clientY = e.clientY - cam.canvasOffsetTop;

		// adjustX=-40 has been set empirically to correct the tile choice
		var adjustX = -40 / zoomLevel;

		var tilex = Math.floor(zoomLevel * (
				((clientX - camX + adjustX) / g_unit_tile_width) +
				((clientY - camY) / g_unit_tile_height)
				));

		var tiley = Math.floor(zoomLevel * (
				((clientY - camY) / g_unit_tile_height) -
				((clientX - camX + adjustX) / g_unit_tile_width)
				));

		if (tilex < 0 || tiley < 0 ||
			tilex >= mapWidth || tiley >= mapHeight)
			return -1;

		if (tilex == undefined || tiley == undefined ||
				isNaN(tilex) || isNaN(tiley))
			return -1;

		return {
			tileY: tiley,
			tileX: tilex
		}
	}

	
	getLayer(num){
		return this._map[num];
	}


	getMapLayers(){
		return this._map;
	}


	getSize(){
		return{
			width: this._width,
			height: this._height
		};
	}


	getWidth(){
		return this._width;
	}


	getHeight(){
		return this._height;
	}


	getLayersNo(){
		return this._layerCtr;
	}
	
	
	exportJSON(){
		var jsonified = "var g_mapLevels = '" + JSON.stringify(this) + "'\n";
		return jsonified;
	}

}

