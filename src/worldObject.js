class WorldObject{

	constructor(frame, drawable, layer, tileX, tileY, tileWidth, tileHeight){
		this._id = WorldObject._id++

		this._frame = frame
		this._drawable = drawable
		this._layer = layer

		this._tileX = tileX
		this._tileY = tileY 
		this._tileWidth = tileWidth 
		this._tileHeight = tileHeight
	}


	getFrame(){
		return this._frame
	}
}

// Static
WorldObject._id = 0
