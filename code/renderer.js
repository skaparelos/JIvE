
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
			start_i:  start_i,
			end_i: end_i,
			start_j: start_j,
			end_j: end_j
		};
	}


	drawMaps(fourEdges){
		var change = this._camera.getChange()
		var changeX = change.changeX
		var changeY = change.changeY

		var zoomLevel = this._camera.getZoomLevel()

		var start_i = fourEdges.start_i
		var end_i = fourEdges.end_i
		var start_j = fourEdges.start_j
		var end_j = fourEdges.end_j
	
		//TODO optimise this to get them whenever there is a change
		var mapLevels = this._map.getMaps()
		var mapLvl0 = mapLevels.mapLvl0
		var mapLvl1 = mapLevels.mapLvl1

		/* draw level 0 */
		for (var i = start_i; i < end_i; i++) { // row
			for (var j = start_j; j < end_j; j++) { // column
				var val = mapLvl0[i][j]
				var img = this._imageManager.get(val)
				img.draw(this._ctx, j, i, changeX, changeY, zoomLevel)
			}
		}

		/* draw level 1 */
		for (var i = start_i; i < end_i; i++) { // row
			for (var j = start_j; j < end_j; j++) { // column
				if (mapLvl1[i][j].type != 0 &&
					mapLvl1[i][j].entity != null)
					mapLvl1[i][j].entity.image.draw(this._ctx, j, i, changeX,
						changeY, zoomLevel, true)
			}
		}

		/* draw tile selector */
		var sel = this._selector.getSelector()
		var tileX = sel.tileX
		var tileY = sel.tileY
		var img = null

		if (mapLvl1[tileY][tileX].type == MapCell.TYPES.EMPTY){
			img = this._imageManager.get("selector")
		}else{  
			img = this._imageManager.get("non-selector")
		}
	
		img.draw(this._ctx, tileX, tileY, changeX, changeY, zoomLevel)
	
	} // end of drawMaps() 

}
