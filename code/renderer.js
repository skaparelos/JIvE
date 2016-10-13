var fake_event = {
  clientX: -1,
  clientY: -1
}


class Renderer{
	constructor(world, ctx, mapWidth, mapHeight, screenWidth, screenHeight, 
			camera){
		this._world = world
		this._ctx = ctx
	
		this._mapWidth = mapWidth
		this._mapHeight = mapHeight

		this._screenWidth = screenWidth
		this._screenHeight = screenHeight
	
		// TODO get this from the Camera
		this._zoomLevel = 2 
		
		this._camera = camera
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

	drawWholeScreen(cameraChange, mapLevels, imgsLvl0, selector){
		this.clearWholeScreen()
		var fourEdges = this.screen2mapViewport()
		let zoomLevel = this._camera.getZoomLevel()
		this.drawMaps(cameraChange, fourEdges, mapLevels, imgsLvl0, selector, zoomLevel)
		// TODO draw entities
	}


	/**
	 *  This function finds the which parts of the map are shown to the player
	 *  and returns them.
	 *  It does so by calculating the 4 edges of the screen and finding the
	 *  their corresponding map cells.
	 */
	screen2mapViewport(){
		// clear the screen
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
		var res = world.screen_2_map_coords(fake_event)
		if (res != -1) {
			start_j = res[1]
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = 0
		res = world.screen_2_map_coords(fake_event)
		if (res != -1) {
			start_i = res[0]
		}

		fake_event.clientX = 0
		fake_event.clientY = this._screenHeight
		res = world.screen_2_map_coords(fake_event)
		if (res != -1) {
			end_i = (res[0] + 2 > mapH) ? mapH : res[0]+2
		}

		fake_event.clientX = this._screenWidth
		fake_event.clientY = this._screenHeight
		res = world.screen_2_map_coords(fake_event)
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

	//TODO remove imgsLvl0
	drawMaps(cameraChange, fourEdges, mapLevels, imgsLvl0, selector, zoomLevel){
		var changeX = cameraChange.changeX
		var changeY = cameraChange.changeY

		var start_i = fourEdges.start_i
		var end_i = fourEdges.end_i
		var start_j = fourEdges.start_j
		var end_j = fourEdges.end_j
	
		var mapLvl0 = mapLevels.mapLvl0
		var mapLvl1 = mapLevels.mapLvl1

		/* draw level 0 */
		for (var i = start_i; i < end_i; i++) { // row
			for (var j = start_j; j < end_j; j++) { // column
				var val = mapLvl0[i][j]
				imgsLvl0[val - 1].draw(this._ctx, j, i, changeX, changeY,
					zoomLevel)
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

		var sel = selector.getSelector()
		var tileX = sel.tileX
		var tileY = sel.tileY
		/* draw tile selector */
		if (mapLvl1[tileY][tileX].type == 0)
			selector.img.draw(this._ctx, tileX, tileY,
				changeX, changeY, zoomLevel)
		else  // draw red if the user cannot build there
			selector.imgNon.draw(this._ctx, tileX, tileY,
				changeX, changeY, zoomLevel)
	} 

}
