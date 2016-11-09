
class Renderer{
	constructor(world, ctx, screenWidth, screenHeight, camera, 
			imageManager, map, selector, spriteSheet){

		this._world = world
		this._ctx = ctx

		// we need the screen width and height to know the space we have for
		// drawing
		this._screenWidth = screenWidth
		this._screenHeight = screenHeight
	
		// we need the camera for the zoom level and for the change 
		// in the X and Y axis
		this._camera = camera

		// we need the imageManager to be able to access images to draw
		this._imageManager = imageManager

		// we need the map to be able to access the map levels directly
		// rather than passing them as parameters. This should be faster
		this._map = map
		this._selector = selector
		this._spriteSheet = spriteSheet
		this._setEvents()

		// this is a micro optimisation to avoid recalculating this for every frame
		this._halfUnitTileWidth = g_unit_tile_width / 2
		this._halfUnitTileHeight = g_unit_tile_height / 2
	}


	/**
	 *  Update the screen size in case it changes
	 */
	updateScreen(screenWidth, screenHeight){
		this._screenWidth = screenWidth
		this._screenHeight = screenHeight
	
		// update events in case of a change in the size	
		this._setEvents()
	}


	/**
	 *
	 *  four events that are used to identify the bounds of the visible map
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
	_setEvents(){
		this._eventLeftUp = {clientX : 0, clientY : 0}
		this._eventRightUp = {clientX : this._screenWidth, clientY : 0}
		this._eventLeftDown = {clientX : 0, clientY : this._screenHeight}
		this._eventRightDown = {clientX : this._screenWidth, clientY : this._screenHeight}

	}


	clearWholeScreen(){
	    this._ctx.clearRect(0, 0, this._screenWidth, this._screenHeight)
	}


	drawWholeScreen(){

		// identify what portion of the map is visible to the user
		var fourEdges = this._map.identifyVisibleMapBounds(this._camera, 
				this._eventLeftUp, this._eventLeftDown, this._eventRightUp, 
				this._eventRightDown)

		this.clearWholeScreen()
		this.drawMaps(fourEdges)
		// TODO draw entities (e.g. Units)
	}


	/**
	 *  Draws the map levels
	 */
	drawMaps(fourEdges){

		var startRow = fourEdges.start_row
		var endRow   = fourEdges.end_row
		var startCol = fourEdges.start_col
		var endCol   = fourEdges.end_col
	
		//TODO optimise this to get them whenever is a change
		var mapLayers = this._map.getMapLayers()
		var totalLayers = mapLayers.length

		//get camera position
		//TODO remove this from here and update it when it is needed
		var cameraPos = this._camera.getPos()
		var camX = cameraPos.x
		var camY = cameraPos.y
		var zoomLevel = this._camera.getZoomLevel()


		for (var layer = 0; layer < totalLayers; layer++){
			var mapLayer = mapLayers[layer].getLayerMap()
			var hasMapCell = mapLayers[layer].hasMapCell()

			for (var row = startRow; row < endRow; row++) { // row
				for (var col = startCol; col < endCol; col++) { // column

					// This means we are drawing background
					if (hasMapCell === false){
						var val = mapLayer[row][col]
						var imgDim = this._spriteSheet.getFrameDimensions(val)
						var imgWidth = imgDim.width
						var imgHeight = imgDim.height

						var coords = this._drawingCoords(row, col, imgWidth, 
							imgHeight, camX, camY, zoomLevel)

						// draw the image
						//this._ctx.drawImage(img, coords.x, coords.y, 
						//		coords.width, coords.height)
						this._spriteSheet.drawFrame(val, coords.x, 
							coords.y, coords.width, coords.height)
					
					}
	
					// That means that we are not drawing background
					if (hasMapCell === true){
						var mapCell = mapLayer[row][col].getMapCell()

						if (mapCell.type !== MapCell.TYPES.EMPTY &&
							mapCell.entity !== null){
							
							//var img = mapCell.entity.getImage()
							//img.draw(...)
							//var imgWidth = img.getWidth()
							//var imgHeight = img.getHeight()
							//var coords = this._drawingCoords(row, col, imgWidth,
							//	imgHeight, true)
							//img.draw(this._ctx, coords.x, coords.y, coords.width,
							//	coords.height)
						}
						
					}
				}
			}
		}


		/* draw tile selector */
		if (this._selector.isHidden() === false && this._selector.getImg() !== null){
			var selectorPos = this._selector.getPos()
			var row = selectorPos.tileY
			var col = selectorPos.tileX
			var img = null

			//if (mapLvl1[row][col].type == MapCell.TYPES.EMPTY){
			//	img = this._imageManager.get("selector")
			//}else{  
			//	img = this._imageManager.get("non-selector")
			//}
			// TODO isn't that something the user has to do?
			// this shouldn't be here
			//TODO use the non-selector as well. let the use decide the 
			// number of layers to base his choice on
	
			img = this._selector.getImg()
			var coords = this._drawingCoords(row, col, img.width, img.height, 
					camX, camY, zoomLevel)	
			this._ctx.drawImage(img, coords.x, coords.y, coords.width, coords.height)
		}

	} // end of drawMaps() 


	// TODO optimise this is called extremely often!!
	// TODO this is called for N layers and recalculates the same thing
	// need to optimise this to be called once for all layers since the result
	// is the same
	_drawingCoords(row, col, imgWidth, imgHeight, camX, camY, zoomLevel){

		// Map to World coords conversion 
		var initX = (col - row) * this._halfUnitTileWidth
		var initY = (row + col) * this._halfUnitTileHeight

		// screen coordinates
		var screenX = initX / zoomLevel + camX
		var screenY = initY / zoomLevel + camY

		// calculate the new tile width & height based on the zoom level
		var widthZoom  = Math.floor(imgWidth / zoomLevel)
		var heightZoom = Math.floor(imgHeight / zoomLevel)

		// make this adjustment (this is to correctly draw any image)
		screenX = Math.floor(screenX - imgWidth / (zoomLevel * 2)
					+ g_unit_tile_width / (zoomLevel * 2))

		screenY = Math.floor(screenY - imgHeight / zoomLevel 
					+ g_unit_tile_height / zoomLevel)
		
		return{
			x: screenX,
			y: screenY,
			width: widthZoom,
			height: heightZoom
		}
	}
}
