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
	}


	/**
	 *  Set the position of the selector
	 */
	setSelectorPos(tileY, tileX){
		this._tileY = tileY
		this._tileX = tileX
	}


	getSelectorPos(){
		return {
			tileX: this._tileX,
			tileY: this._tileY
		}
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
 *  A map cell represents the contents of the level1 map
 *  The level0 map only consists of background tiles, that do not carry any
 *  extra information, however, level1 map cells carry a lot of information
 *  and this class is made to contain it. 
 */
class MapCell{
	constructor(type){
		/* TODO	do we need the id? */
		this._id = 0

		/*  (This helps path finding)
			Types:
			0 -> nothing is here
			1 -> non-walkable surface. i.e. either building or tree or etc..
			2 -> sprites */
		this._type = type

		/* This should hold the building instance or the sprite instance */
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


	getMapLayers(){
		return this._map
	}


	getWidth(){
		return this._width
	}


	getHeight(){
		return this._height
	}
}


