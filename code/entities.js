class BaseEntity {
	constructor(x, y){
		this._id = id
		this._tileX = x
		this._tileY = y
	}
}


class BaseEntityHP extends BaseEntity{
	constructor(x, y, hp){
		super(x, y)
		this._hp = hp
	}
}


class BaseBuilding extends BaseEntityHP{
	constructor(x, y, hp, tileWidth, tileHeight){
		super(x, y, hp)
		this._tileWidth = tileWidth
		this._tileHeight = tileHeight
	}
}


class BaseUnit extends BaseEntityHP{
	constuctor(x, y, hp){
		super(x, y, hp)
	}
}


