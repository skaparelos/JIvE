
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
		this._mapWidth = map.getWidth()
		this._mapHeight = map.getHeight()

		this._selector = selector

		this._spriteSheet = spriteSheet
	}


	/**
	 *  Update the screen size in case it changes
	 */
	updateScreen(screenWidth, screenHeight){
		this._screenWidth = screenWidth
		this._screenHeight = screenHeight
	}


	clearWholeScreen(){
	    this._ctx.clearRect(0, 0, this._screenWidth, this._screenHeight)
	}


	drawWholeScreen(){	
		var fourEdges = this.screen2mapViewport()
		this.clearWholeScreen()
		this.drawMaps(fourEdges)
		// TODO draw entities (e.g. Units)
	}


	/**
	 *  This function finds which parts of the map are shown to the player
	 *  and returns them.
	 *  It does so by calculating the 4 edges of the screen and finding the
	 *  their corresponding map cells.
	 * 
	 *  e.g. screen with four Edges (E)
	 *  E-----------E
	 *  |           |
	 *  |           |
     *  |           |
	 *  E-----------E
	 *
	 *  imagine that the map is bigger than the screen
	 *  so that the screen only shows a portion of the map.
	 */
	screen2mapViewport(){

		/*
			Check the 4 edges of the screen to see which tiles are there.
			Then draw the tiles that can appear on the screen and nothing more

			This is a big reduction:
			in a 200x200 map we drop from 40.000 iterations to about 1000. 
		*/

		var mapH = this._mapHeight
		var mapW = this._mapWidth
		var world = this._world
		
		var start_row = 0
		var start_col = 0
		var end_row = mapH
		var end_col = mapW

		fake_event.clientX = 0
		fake_event.clientY = 0
		var res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			start_col = res.tileX
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = 0
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			start_row = res.tileY
		}

		fake_event.clientX = 0
		fake_event.clientY = this._screenHeight
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			end_row = (res.tileY + 2 > mapH) ? mapH : res.tileY + 2
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = this._screenHeight
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			end_col = (res.tileX + 1 > mapW) ? mapW : res.tileX + 1
		}

		return {
			start_row:  start_row,
			end_row: end_row,
			start_col: start_col,
			end_col: end_col
		};
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

		for (var layer = 0; layer < totalLayers; layer++){
			var mapLayer = mapLayers[layer].getLayerMap()
			var hasMapCell = mapLayers[layer].hasMapCell()

			for (var row = startRow; row < endRow; row++) { // row
				for (var col = startCol; col < endCol; col++) { // column

					// This means we are drawing background
					if (hasMapCell === false){
						var val = mapLayer[row][col]
						var dim = this._spriteSheet.getFrameDimensions(val + "")
						var imgWidth = dim.width
						var imgHeight = dim.height
						//var img = this._imageManager.get(val + "")	
						//var imgWidth = img.width
						//var imgHeight = img.height
						var coords = this._drawingCoords(row, col, imgWidth, 
							imgHeight, false)

						// draw the image
						//this._ctx.drawImage(img, coords.x, coords.y, 
						//		coords.width, coords.height)
						this._spriteSheet.drawFrame(val + "", coords.x, 
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
		if (this._selector.isHidden() === false){
			var sel = this._selector.getSelectorPos()
			var row = sel.tileY
			var col = sel.tileX
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
	
			img = this._imageManager.get("selector")
			var coords = this._drawingCoords(row, col, img.width, img.height)	
			this._ctx.drawImage(img, coords.x, coords.y, coords.width, coords.height)
		}

	} // end of drawMaps() 


	// TODO optimise this is called extremely often!!	
	_drawingCoords(row, col, imgWidth, imgHeight, entity){
		var cameraPos = this._camera.getPos()
		var camX = cameraPos.x
		var camY = cameraPos.y

		//TODO remove this from here and update it when it is needed
		var zoomLevel = this._camera.getZoomLevel()
	
		// Map to World coords conversion 
		var initX = (col - row) * g_unit_tile_width / 2
		var initY = (row + col) * g_unit_tile_height / 2

		// screen coordinates
		var screenX = Math.floor(initX / zoomLevel + camX)
		var screenY = Math.floor(initY / zoomLevel + camY)

		// calculate the new tile width & height based on the zoom level
		var widthZoom = Math.floor(imgWidth / zoomLevel)
		var heightZoom = Math.floor(imgHeight / zoomLevel)

		// If we are not drawing background, make this adjustment
		if (entity === true){

			screenX = Math.floor(screenX - imgWidth / (zoomLevel * 2)
					+ g_unit_tile_width / (zoomLevel * 2))

			screenY = Math.floor(screenY - imgHeight / zoomLevel 
					+ g_unit_tile_height / zoomLevel)
		}
		
		return{
			x: screenX,
			y: screenY,
			width: widthZoom,
			height: heightZoom
		}
	}
}