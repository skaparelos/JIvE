/**
 *  The selector is where the mouse points at at any given instance.
 *  i.e. which tile the user has selected
 */

class Selector{
	constructor(){
		this.tileX = 0
		this.tileY = 0
	}

	setSelector(tileY, tileX){
		this.tileX = tileX
		this.tileY = tileY
	}

	getSelector(){
		return {
			tileX: this.tileX,
			tileY: this.tileY
		}
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
		this.id = 0

		/*  (This helps path finding)
			Types:
			0 -> nothing is here
			1 -> non-walkable surface. i.e. either building or tree or etc..
			2 -> sprites */
		this.type = type

		/* This should hold the building instance or the sprite instance */
		this.entity = null
	}


	getEntity(){
		return this.entity
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
	}


	/**
	 *	If withMapCell is true, then that layer will have a map cell
	 */ 
	load(map, withMapCell){
		if (withMapCell === false)
			this._map = map

		if (withMapCell === true){
			var mapWidth = map[0].length
			var mapHeight = map.length

			for (var i = 0; i < mapHeight; i++) {
				this._map[i] = []
				for (var j = 0; j < mapWidth; j++) { 
					this._map[i][j] = new MapCell(map[i][j])
				} 
			} 
		}
	}


	getLayer(){
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

		// we do the width and height update everytime since we do not
		// know the total number of layers in advance  
		this._width = mapLayer.getLayer()[0].length
		this._height = mapLayer.getLayer().length
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


