/**
* An entity is anything besides background tiles.
* A rock is an entity with isWalkable false
* BACKGROUND TILES DO NOT COUNT AS ENTITIES
*/

class Entity{


	constructor(mapY, mapX, gid, map, walkable){

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

		var scrnCoords = Utils.map2ScreenCoords(
			mapY, mapX,
			map.getGID(gid)["w"], map.getGID(gid)["h"], 
			camera.getCamera().x, camera.getCamera().y, camera.getCamera().zoomLvl, 
			map.getTileWidth(), map.getTileHeight()
			);


		this.screenX = scrnCoords.x; 
		this.screenY = scrnCoords.y;

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
	move(dx, dy, map){

		// TODO change this, we now use a linked list
		map.setTile(2, this.mapX, this.mapY, 0);
		this.mapX += dx;
		this.mapY += dy;
		map.setTile(2, this.mapX, this.mapY, this.gid);
	}


	update(dxdy, dt){
		if(!this.isAlive) return;
		this.screenX += dxdy.dx;
		this.screenY += dxdy.dy;
	}

}

Entity.id = 0;
