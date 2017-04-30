/**
* An entity is anything besides background tiles.
* The entity class is a base class for other classes.
* Examples of entities are: units, items, fringe, rocks, houses...
* Background tiles are not considered entities.
*/

class Entity{


	constructor(screenX, screenY, gid){

		//JIVE.entities.push(this);
		this.id = Entity.id++;
		this.gid = gid;

		// the x,y coordinates in the screen
		this.screenX = screenX;
		this.screenY = screenY;

		// indicates whether the entity is alive
		this.isAlive = true;

		// indicates whether this entity can be walked over
		// e.g. like doors or whatever else
		this.isWalkable = null;

		return this;
	}

	setWalkable(w){
		this.isWalkable = w;
		return this;
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
		if (!this.isAlive || !this.isWalkable) return;

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
