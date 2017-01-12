class Renderer{

	constructor(ctx, camera, map, spriteSheet, selector){
		this._ctx = ctx;

		// how much off the screen to draw
		this._offset = g_unit_tile_width / 2;
	
		// we need to know the position of the camera as well as its zoom level
		this._camera = camera;

		// we need the map to be able to access the map levels directly
		// rather than passing them as parameters. This should be faster
		this._map = map;
		this._spriteSheet = spriteSheet;
        this._selector = selector;
	}


	clearWholeScreen(camera){
	    this._ctx.clearRect(0, 0, camera.width, camera.height);
	}


	drawWholeScreen(){
        var camera = this._camera.getCamera();
		this.clearWholeScreen(camera);
		this.drawMapLayers(camera);
	}


	/**
	 *  Draws the map layers
	 */
	drawMapLayers(camera){

        // get camera position
        var camX = camera.x;
        var camY = camera.y;
        var zoomLevel = camera.zoomLevel;
        var viewPortWidth = camera.width;
        var viewPortHeight = camera.height;

        // the range of rows and cols that we need to look for drawing
        var fourEdges = this._camera.identifyVisibleMapBounds(this._map);
		var startRow = fourEdges.startRow;
		var endRow   = fourEdges.endRow;
		var startCol = fourEdges.startCol;
		var endCol   = fourEdges.endCol;

		// get the number of layers
		var totalLayers = this._map.getLayersNo();

		for (var layer = 0; layer < totalLayers; layer++){
			var mapLayer = this._map.getLayer(layer);

			for (var row = startRow; row < endRow; row++) {

				for (var col = startCol; col < endCol; col++) {
					var mapCell = mapLayer.getCell(row, col);
					var worldObjectId = mapCell.worldObjectId;

					if (mapCell.type !== MapCell.TYPES.EMPTY &&
                        worldObjectId !== null ){

                        //TODO
                        //WorldObject.worldObjects[worldObjectId].isDrawable()) {

                        WorldObject.worldObjects[worldObjectId].draw(
                        	this._spriteSheet, row, col, camX, camY, zoomLevel,
							this._offset, viewPortWidth, viewPortHeight);
					}
				}
			}
		}

		// draw tile selector
		var selectorImg = this._selector.getImg();
        var selectorPos = this._selector.getPos();
        var row = selectorPos.tileY;
        var col = selectorPos.tileX;
		if (this._selector.isHidden() === false && selectorImg !== null
			&& row !== -1 && col !== -1 ){

			var img = null;

			var coords = WorldObject.drawingCoords(row, col, selectorImg.width,
				selectorImg.height, camX, camY, zoomLevel);
			this._ctx.drawImage(selectorImg, coords.x, coords.y, coords.width,
				coords.height);
		}
	} // end of drawMaps()
}
