/**
* An entity is anything besides background tiles.
* A rock is an entity with isWalkable false
* BACKGROUND TILES DO NOT COUNT AS ENTITIES
*/

class Entity{


	constructor(mapY, mapX, gid, walkable){

		this.id = Entity.id++;
		this.gid = gid;

		// the coordinates of the entity in the map
		// these can be integers
		this.mapX = mapX || 0;
		this.mapY = mapY || 0;

		// these hold the width and height of the entity
		// in number of tiles
		this.width = 1;
		this.height = 1;

		// these are used for drawing
		// i.e. don't show everything in the middle of the tile
		var screenCoords = Utils.map2ScreenCoords(
			mapY, mapX,
			map.getGID(gid)["w"], map.getGID(gid)["h"], 
			camera
			);
		this.screenX = screenCoords.x; 
		this.screenY = screenCoords.y;

		this.speed = 0.3;

		// indicates whether the entity is alive
		this.isAlive = true;

		// indicates whether this entity can be walked over
		// e.g. like doors or whatever else
		this.isWalkable = walkable || false;

	}

	getEntity(){
		return{
			isAlive: this.isAlive,
			screenX: this.screenX,
			screenY: this.screenY,
			gid: this.gid
		};
	}

	/**
	* Moves the entity to a different position
	*/
	move(dx, dy, camera){

		// update the screen coords
		this.screenX += dx;
		this.screenY += dy;

		// calculate the new map coords
		var coords = Utils.screen2MapCoords({clientX: this.screenX, clientY: this.screenY}, camera);
		this.mapX = coords.tileX;
		this.mapY = coords.tileY;

		return this;
	}

	moveTo(x, y){
		this._finalx = x;
		this._finaly = y;
	}

	update(dxdy, dt){
		if(!this.isAlive) return;
		this.screenX += dxdy.dx;
		this.screenY += dxdy.dy;

	}

}

Entity.id = 0;
