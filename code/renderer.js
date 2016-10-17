
class Renderer{
	constructor(world, ctx, screenWidth, screenHeight, camera, 
			imageManager, map, selector){
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

	}


	/**
	 *  Update the screen size in case it changes
	 */
	//TODO when a change is made update this 
	updateScreen(screenWidth, screenHeight){
		this._screenWidth = screenWidth
		this._screenHeight = screenHeight
	}


	clearWholeScreen(){
	    this._ctx.clearRect(0, 0, this._screenWidth, this._screenHeight)
	}


	drawWholeScreen(){
		this.clearWholeScreen()
		var fourEdges = this.screen2mapViewport()
		let zoomLevel = this._camera.getZoomLevel()
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
	 *  imagine that the map is bigger is bigger than the screen
	 *  so that the screen only shows a portion of the map.
	 */
	screen2mapViewport(){
		this.clearWholeScreen()

		/*
			Check the 4 edges of the screen to see which tiles are there.
			Then draw the tiles that can appear on the screen and nothing more

			This is a big reduction:
			in a 200x200 map we drop from 40.000 iterations to about 1000. 
		*/

		var mapH = this._mapHeight
		var mapW = this._mapWidth
		var world = this._world
		
		var start_i = 0
		var start_j = 0
		var end_i = mapH
		var end_j = mapW

		// res[0] -> tiley
		// res[1] -> tilex

		fake_event.clientX = 0
		fake_event.clientY = 0
		var res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			start_j = res[1]
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = 0
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			start_i = res[0]
		}

		fake_event.clientX = 0
		fake_event.clientY = this._screenHeight
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			end_i = (res[0] + 2 > mapH) ? mapH : res[0]+2
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = this._screenHeight
		res = world.screen2MapCoords(fake_event)
		if (res != -1) {
			end_j = (res[1] + 1 > mapW) ? mapW : res[1] + 1
		}

		return {
			start_row:  start_i,
			end_row: end_i,
			start_col: start_j,
			end_col: end_j
		};
	}


	/**
	 *  Draws the map levels
	 */
	drawMaps(fourEdges){
		var start_row = fourEdges.start_row
		var end_row = fourEdges.end_row
		var start_col = fourEdges.start_col
		var end_col = fourEdges.end_col
	
		//TODO optimise this to get them whenever there is a change
		var mapLevels = this._map.getMaps()
		var mapLvl0 = mapLevels.mapLvl0
		var mapLvl1 = mapLevels.mapLvl1

		/* draw level 0 */
		for (var row = start_row; row < end_row; row++) { // row
			for (var col = start_col; col < end_col; col++) { // column

				var val = mapLvl0[row][col]
				var img = this._imageManager.get(val)	
				var imgWidth = img.getWidth()
				var imgHeight = img.getHeight()

				var coords = this._drawingCoords(row, col, imgWidth, imgHeight)
	
				// draw the image	
				img.draw(this._ctx, coords.x, coords.y, coords.width,
					coords.height)
			}
		}

		/* draw level 1 */
		for (var row = start_row; row < end_row; row++) { // row
			for (var col = start_col; col < end_col; col++) { // column

				if (mapLvl1[row][col].type !== MapCell.TYPES.EMPTY  &&
						mapLvl1[row][col].entity !== null){
					
				//mapLvl1[row][col].entity.image.draw(this._ctx, col, row, changeX,
				//		changeY, zoomLevel, true)	

				/*
				// TODO fix when I create an entity
				var entity = mapLvl1[row][col].getEntity()...
				var img = this._imageManager.get(entity.getCode....)
		
				var imgWidth = img.getWidth()
				var imgHeight = img.getHeight()
					
				// calculate the actual screenX and screenY
				var screenXX = Math.round(screenX - imgWidth / (zoom_level * 2)
					+ g_unit_tile_width / (zoomLevel * 2))
				var screenYY = Math.round(screenY - imgHeight / zoom_level 
					+ g_unit_tile_height / zoomLevel)

				// draw the image
				img.draw(this._ctx, screenXX, screenYY, widthZoom, heightZoom)
				*/
				}
			}
		}


		/* draw tile selector */
		var sel = this._selector.getSelector()
		var row = sel.tileY
		var col = sel.tileX
		var img = null

		if (mapLvl1[row][col].type == MapCell.TYPES.EMPTY){
			img = this._imageManager.get("selector")
		}else{  
			img = this._imageManager.get("non-selector")
		}

		var coords = this._drawingCoords(row, col, img.getWidth(), img.getHeight())	
		img.draw(this._ctx, coords.x, coords.y, coords.width, coords.height)
	
	} // end of drawMaps() 


	// TODO optimise this is called extremely often!!	
	_drawingCoords(row, col, imgWidth, imgHeight){
		var change = this._camera.getChange()
		var changeX = change.changeX
		var changeY = change.changeY

		//TODO remove this from here and update it when it is needed
		var zoomLevel = this._camera.getZoomLevel()
	
		// Map to World coords conversion 
		var initX = (col - row) * g_unit_tile_width / 2
		var initY = (row + col) * g_unit_tile_height / 2

		// screen coordinates
		var screenX = Math.floor(initX / zoomLevel + changeX)
		var screenY = Math.floor(initY / zoomLevel + changeY)

		// calculate the new tile width & height based on the zoom lvl
		var widthZoom = Math.floor(imgWidth / zoomLevel)
		var heightZoom = Math.floor(imgHeight / zoomLevel)

		return{
			x: screenX,
			y: screenY,
			width: widthZoom,
			height: heightZoom
		}
	}
}
