/**
 *  The selector is where the mouse points at at any given instance.
 *  i.e. which tile the user has selected
 */

class Selector{

	constructor(){
		this._tileX = 0
		this._tileY = 0

		// set to "true" if you don't want it to be drawn
		this._isHidden = false

		// the image of the selector
		this._img = null
	}


	setPos(tileY, tileX){
		this._tileY = tileY
		this._tileX = tileX
	}


	getPos(){
		return {
			tileX: this._tileX,
			tileY: this._tileY
		}
	}
	

	setImg(img){
		this._img = img
	}


	getImg(){
		return this._img
	}

	
	isHidden(){
		return this._isHidden
	}


	setHidden(hidden){
		this._hidden = hidden
	}
}


/* ------------------------------------------------------------------------ */


/**
 *  A map cell represents the contents of each cell in a map
 *
 *  TODO
 *  at the moment not all layers have mapCells. particularly the background 
 *  layer does not need one
 *  
 */
class MapCell{

	//TODO think: keep the image of the imagecell here? I don't think it's a good
	// think to do as we will be wasting space
	
	// TODO think: i could put here initX, initY, and screenX, screenY 
	// and have an update function
	// this is more compact.
	// because as it is now we would have to make changes in the renderer as well


	constructor(type){

		// TODO	do we need the id?
		this._id = 0

		//  (This helps path finding)
		//	Types:
		//	0 -> nothing is here
		//	1 -> non-walkable surface. i.e. either building or tree or etc..
		//	2 -> sprites 
		this._type = type

		// This should hold the building instance or the sprite instance
		this._entity = null
	}


	getMapCell(){
		return {
			id: this.id,
			type: this._type,
			entity: this._entity
		}
	}


	getEntity(){
		return this._entity
	}


	getType(){
		return this._type
	}

}

// TODO change this and let the user define it
MapCell.TYPES = {
	EMPTY : 0,
	NON_WALKABLE : 1,
	SPRITE : 2	
}


/* ------------------------------------------------------------------------ */


/**
 * TODO: It is not clear yet, wheter a map layer consists of map cells 
 * (see above class) or not. Since map cells carry more information we should
 * only use them when necessary, otherwise just carry integers to denote
 * tile and terrain. However, it could be better (need to look at this) if each
 * map layer consisted solely of mapcells. 
 *
 * A map layer represents a layer. e.g. background is one layer
 * non-moving objects can be a second layer (e.g. buildings and trees)
 * sprites might be a third layer. etc..
 *
 * Note: all mapLayers must have the same dimensions. Dimensions are available
 * from Map class (since they are all the same)
 */ 
class MapLayer{

	constructor(){
		this._map = []
		this._hasMapCell = false
	}


	/**
	 *	If withMapCell is true, then that layer will have a map cell
	 */ 
	load(map, withMapCell){

		if (withMapCell === false){
			this._map = map
			this._hasMapCell = false
		}

		if (withMapCell === true){
			var mapWidth = map[0].length
			var mapHeight = map.length
			this._hasMapCell = true

			for (var i = 0; i < mapHeight; i++) {
				this._map[i] = []
				for (var j = 0; j < mapWidth; j++) { 
					this._map[i][j] = new MapCell(map[i][j])
				} 
			} 
		}
	}


	/**
	 *  Returns true if the current map layer has map cells or not
	 *  This is used in order to know how to access the mapLayer
	 */
	hasMapCell(){
		return this._hasMapCell
	}


	getLayerMap(){
		return this._map
	}


	setCell(row, col, value){
		this._map[row][col] = value
		// TODO
		//if (this._hasMapCell)	
	}


	clear(){
		this._map = []
	}

}


/* ------------------------------------------------------------------------ */


/**
 *
 */
class Map{

	constructor(){
		this._width = 0
		this._height = 0
		this._map = []
	}


	addLayer(mapLayer){
		this._map.push(mapLayer)

		// we update the width and height everytime since we do not
		// know the total number of layers in advance (these should be the same
		// for each layer) 
		this._width = mapLayer.getLayerMap()[0].length
		this._height = mapLayer.getLayerMap().length
		console.log('map width = ' + this._width + ' height = ' + this._height)

		// Set maximum scroll based on the map size
		// TODO add this in camera.js
		//this._maxChangeX = (this._width * (g_unit_tile_width / 2))
		//this._maxChangeY = (this._height * (g_unit_tile_height / 2)) / 2
	}


	/**
	 *  This function finds which parts of the map are shown to the player
	 *  and returns them. i.e. which portion of the map the user sees.
	 *
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
	identifyVisibleMapBounds(camera, eLeftUp, eLeftDown, eRightUp, eRightDown){

		/*
			Check the 4 edges of the screen to see which tiles are there.
			Then draw the tiles that can appear on the screen and nothing more

			This is a big reduction:
			in a 200x200 map we drop from 40.000 iterations to about 1000. 
		*/

		var mapH = this._height
		var mapW = this._width
		var world = this._world
		
		var start_row = 0
		var start_col = 0
		var end_row = mapH
		var end_col = mapW

		var res = this.screen2MapCoords(eLeftUp, camera)
		if (res != -1) {
			start_col = res.tileX
		}

		res = this.screen2MapCoords(eRightUp, camera)
		if (res != -1) {
			start_row = res.tileY
		}

		res = this.screen2MapCoords(eLeftDown, camera)
		if (res != -1) {
			end_row = (res.tileY + 2 > mapH) ? mapH : res.tileY + 2
		}

		res = this.screen2MapCoords(eRightDown, camera)
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

		var mapWidth = this._width
		var mapHeight = this._height

		var cameraPos = camera.getPos()
		var camX = cameraPos.x
		var camY = cameraPos.y
		var zoomLevel = camera.getZoomLevel()

		// adjustX=-40 has been set empirically to correct the tile choice
		var adjustX = -40 / zoomLevel

		var tilex = Math.floor(zoomLevel * (
				((e.clientX - camX + adjustX) / g_unit_tile_width) +
				((e.clientY - camY) / g_unit_tile_height)
				))

		var tiley = Math.floor(zoomLevel * (
				((e.clientY - camY) / g_unit_tile_height) -
				((e.clientX - camX + adjustX) / g_unit_tile_width)
				))

		if (tilex < 0 || tiley < 0 ||
			tilex >= mapWidth || tiley >= mapHeight)
			return -1

		if (tilex == undefined || tiley == undefined ||
				isNaN(tilex) || isNaN(tiley))
			return -1

		return {
			tileY: tiley,
			tileX: tilex
		}
	}

	
	getLayer(num){
		return this._map[num]
	}


	getMapLayers(){
		return this._map
	}


	getWidth(){
		return this._width
	}


	getHeight(){
		return this._height
	}

	
	toJSON(){

	}
}


