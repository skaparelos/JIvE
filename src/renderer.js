class Renderer{

	constructor(world, ctx, screenWidth, screenHeight, camera, 
			imageManager, map, selector, spriteSheet){

		this._world = world;
		this._ctx = ctx;

		// we need the screen width and height to know the space we have for
		// drawing
		// TODO put this in camera and get it from there
		this._screenWidth = screenWidth;
		this._screenHeight = screenHeight;

		// how much off the screen to draw
		this._offset = g_unit_tile_width / 2;
	
		// we need the camera for the zoom level and for the change 
		// in the X and Y axis
		this._camera = camera;

		// we need the imageManager to be able to access images to draw
		this._imageManager = imageManager;

		// we need the map to be able to access the map levels directly
		// rather than passing them as parameters. This should be faster
		this._map = map;
		this._selector = selector;
		this._spriteSheet = spriteSheet;
		this._setCustomCornerScreenEvents();
	}


	/**
	 *  This function should be called to notify the renderer whenever
	 *  there is a change in the screen size.
	 */
	updateScreen(screenWidth, screenHeight){
		this._screenWidth = screenWidth;
		this._screenHeight = screenHeight;
	
		// update events in case of a change in the size	
		this._setCustomCornerScreenEvents();
	}


	/**
	 *
	 *  Four events that are used to identify the bounds of the visible map
	 *  portion to the user
	 *  
	 *  Imagine this is the screen:
	 *
	 *  E-----------E
	 *  |           |
	 *  |           |
     *  |           |
	 *  E-----------E
	 */
	_setCustomCornerScreenEvents(){
		this._eventLeftUp = {clientX : 0, clientY : 0};
		this._eventRightUp = {clientX : this._screenWidth, clientY : 0};
		this._eventLeftDown = {clientX : 0, clientY : this._screenHeight};
		this._eventRightDown = {clientX : this._screenWidth,
			clientY : this._screenHeight};

	}


	clearWholeScreen(){
	    this._ctx.clearRect(0, 0, this._screenWidth, this._screenHeight)
	}


	drawWholeScreen(){

		// identify what portion of the map is visible to the user
		var fourEdges = this._map.identifyVisibleMapBounds(this._camera, 
				this._eventLeftUp, this._eventLeftDown, this._eventRightUp, 
				this._eventRightDown)

		this.clearWholeScreen();
		this.drawMapLayers(fourEdges);
	}


	/**
	 *  Draws the map layers
	 */
	drawMapLayers(fourEdges){

		var startRow = fourEdges.start_row;
		var endRow   = fourEdges.end_row;
		var startCol = fourEdges.start_col;
		var endCol   = fourEdges.end_col;
	
		var mapLayers = this._map.getMapLayers();
		var totalLayers = mapLayers.length;

		//get camera position
		var cameraPos = this._camera.getPos();
		var camX = cameraPos.x;
		var camY = cameraPos.y;
		var zoomLevel = this._camera.getZoomLevel();

		// TODO do it like this? or just go through the world items?
		for (var layer in mapLayers){
			var mapLayer = mapLayers[layer].getLayerMap();

			for (var row = startRow; row < endRow; row++) { 

				for (var col = startCol; col < endCol; col++) {
					var mapCell = mapLayer[row][col].getMapCell();

					if (mapCell.type !== MapCell.TYPES.EMPTY &&
						mapCell.worldObjectId !== null) {
							

						var worldObjectId = mapCell.worldObjectId;
						var val = WorldObject.worldObjects[worldObjectId].getFrame();
						var imgDim = this._spriteSheet.getFrameDimensions(val);
						var imgWidth = imgDim.width;
						var imgHeight = imgDim.height;

						var coords = this._drawingCoords(row, col, imgWidth, 
							imgHeight, camX, camY, zoomLevel);

						// if the image position is visible to the user
						// draw it. add some offset in the calculation
						// to make it look better.
						if (coords.x > 0 - this._offset &&
							coords.y > 0 - this._offset && 
							coords.x < this._screenWidth + this._offset &&
							coords.y < this._screenHeight + this._offset){

								this._spriteSheet.drawFrame(val, coords.x, 
									coords.y, coords.width, coords.height)	
						}
					}
				}
			}
		}

		// draw tile selector
		var selectorImg = this._selector.getImg();
		if (this._selector.isHidden() === false && selectorImg !== null){
			var selectorPos = this._selector.getPos();
			var row = selectorPos.tileY;
			var col = selectorPos.tileX;
			var img = null;

			// TODO drawing the selector is something the user has to do
			// this shouldn't be here
	
			var coords = this._drawingCoords(row, col, selectorImg.width,
				selectorImg.height, camX, camY, zoomLevel);
			this._ctx.drawImage(selectorImg, coords.x, coords.y, coords.width,
				coords.height);
		}

	} // end of drawMaps() 



    /**
	 * Calculates the drawing coordinates of an image, given its map position
	 * (i.e. row, col), its width & height, as well as the camera position and
	 * the zoom level.
	 *
	 * TODO optimise this is called extremely often!!
     * TODO this is called for N layers and recalculates the same thing
     * need to optimise this to be called once for all layers since the result
     * is the same
	 *
     * @param row
     * @param col
     * @param imgWidth
     * @param imgHeight
     * @param camX
     * @param camY
     * @param zoomLevel
     * @returns {{x: *, y: *, width: number, height: number}}
     * @private
     */
	_drawingCoords(row, col, imgWidth, imgHeight, camX, camY, zoomLevel){

		// Map to screen coords conversion
		var initX = (col - row) * g_unit_tile_width / 2;
		var initY = (row + col) * g_unit_tile_height / 2;

		// adjust screen coordinates based on zoom level and camera position
		var screenX = initX / zoomLevel + camX;
		var screenY = initY / zoomLevel + camY;

		// calculate the new tile width & height based on the zoom level
		var widthZoom  = Math.floor(imgWidth / zoomLevel);
		var heightZoom = Math.floor(imgHeight / zoomLevel);

		// make this adjustment to position the image correctly
		// (this is to correctly draw any image)
		screenX = Math.floor(screenX - imgWidth / (zoomLevel * 2)
			+ g_unit_tile_width / (zoomLevel * 2));

		screenY = Math.floor(screenY - imgHeight / zoomLevel
			+ g_unit_tile_height / zoomLevel);
		
		return{
			x: screenX,
			y: screenY,
			width: widthZoom,
			height: heightZoom
		}
	}
}
