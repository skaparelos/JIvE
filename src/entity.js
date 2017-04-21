/*this is for entities only. BACKGROUND TILES DO NOT COUNT AS ENTITIES

class

position: x,y
size: width, height
isAlive = True


update(){


}

draw(){


	note: Here is where draw happens
	i.e. call here
	drawImage(....)
}*/

/**
* An entity is anything besides background tiles.
* A rock is an entity with isWalkable false
*/

class Entity{


	constructor(x, y, gid){

		// the coordinates of the entity in the map
		// these can be integers
		this.mapX = x || 0;
		this.mapY = y || 0; 

		// TODO: these are to allow some flexibility in the screen
		// i.e. don't show everything in the middle of the tile
		// this.screenX = 0; 
		// this.screenY = 0;

		// these hold the width and height of the entity
		// in number of tiles
		this.width = 1;
		this.height = 1;

		// indicates whether the entity is alive
		this.isAlive = true;

		// indicates whether this entity can be walked over
		// e.g. like doors or whatever else
		this.isWalkable = false;

		this.gid = gid;

	}

	move(dx, dy, map){
		map.setTile(2, this.mapX, this.mapY, 0);
		this.mapX += dx;
		this.mapY += dy;
		map.setTile(2, this.mapX, this.mapY, this.gid);
	}

	update(){
		if(!this.isAlive) return;
	}


	getMapX(){
		return this.mapX;
	}


	getMapY(){
		return this.mapY;
	}

}
