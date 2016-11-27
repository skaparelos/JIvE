/**
 * WorldObject represents an entity that the user has placed in the map.
 * It can be a tile, a house, a tree, a unit, etc.
 */
class WorldObject{

	constructor(frame, drawable, layer, tileX, tileY, tileWidth, tileHeight){
		WorldObject.worldObjects[WorldObject._id] = this;
		this._id = WorldObject._id++;
		
		this._frame = frame;
		this._drawable = drawable;
		this._layer = layer;
		this._walkable = true;

		this._tileX = tileX;
		this._tileY = tileY;
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;
	}


	getFrame(){
		return this._frame;
	}


	getID(){
		return this._id;
	}


	setWalkable(walkable){
		this._walkabe = walkable;
	}


	getWalkable(){
		return this._walkable;
	}


	static load(worldObjects){
		var objectsJSONed = JSON.parse(worldObjects)

		for (var object in objectsJSONed){
			var o = objectsJSONed[object];
			new WorldObject(o._frame, o._drawable, o._layer, o._tileX, o._tileY,
				o._tileWidth, o._tileHeight);
		}
	}


	static exportJSON(){
		if (WorldObject.worldObjects.length == 0) return;
		var jsonified = "var g_worldObjects = '" + JSON.stringify(WorldObject.worldObjects) + "';\n";
		return jsonified;
	}
}


// Static
WorldObject._id = 0;
WorldObject.worldObjects = [];
