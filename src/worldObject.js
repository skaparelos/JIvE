class WorldObject{

	constructor(tileX){
		this._id = WorldObject.id++
		this._tileX = tileX
		this._tileY = tileY
		this._tileWidth = tileWidth
		this._tileHeight = tileHeight
		this._frame = frame
		this._drawable = drawable
		this._layer = layer
	}

}

// Static
WorldObject.id = 0
