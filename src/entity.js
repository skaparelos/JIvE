/**
* An entity is anything besides background tiles.
* A rock is an entity with isWalkable false
* BACKGROUND TILES DO NOT COUNT AS ENTITIES
*/

class Entity{


	constructor(screenX, screenY, gid){

		JIVE.entities.push(this);
		this.id = Entity.id++;
		this.gid = gid;

		// these are used for drawing
		// i.e. don't show everything in the middle of the tile
		this.screenX = screenX; 
		this.screenY = screenY;

		// indicates whether the entity is alive
		this.isAlive = true;

		// indicates whether this entity can be walked over
		// e.g. like doors or whatever else
		this.isWalkable = null;

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

		return this;
	}


	/**
	* called every frame to update the entity
	*/
	update(dxdy, dt){
		if(!this.isAlive) return;
		this.screenX += dxdy.dx;
		this.screenY += dxdy.dy;
	}

}

/* @static */
Entity.id = 0;

// A list containing all the entities of the game
JIVE.entities = [];
