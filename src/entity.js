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

	constructor(){

		// the coordinates of the entity in the map
		// these can be integers
		this.mapX = 0;
		this.mapY = 0; 

		// TODO: these are to allow some flexibility in the screen
		// i.e. don't show everything in the middle of the tile
		// this.screenX = 0; 
		// this.screenY = 0;

		// these hold the width and height of the entity
		// in number of tiles
		this.width = 0;
		this.height = 0;

		// indicates whether the entity is alive
		this.isAlive = true;

		// indicates whether this entity can be walked over
		// e.g. like doors or whatever else
		this.isWalkable = false;
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