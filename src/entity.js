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
		// e.g. like doors or bridge or whatever else
		this.isWalkable = null;

		// if it has been selected by the user
		this.isSelected = false;

        Entity.entities.push(this);

        // takes the class name and adds it to a dictionary
        // so we can create new objects on the fly by evaluating
        // the class name
        var subClassName = this.__proto__.constructor.name;
        if(Entity._factory[subClassName] == null
            && subClassName != "Entity") {
            Entity._factory[subClassName] = function (x, y, gid) {
                var o = eval("new " + subClassName + "(" + x + "," + y + "," + gid + ");");
                return o;
            }
        }
		return this;
	}


	isSelected(){
		return this.isSelected;
	}


	setWalkable(w){
		this.isWalkable = w;
		return this;
	}


	getEntity(){
		return{
			isAlive: this.isAlive,
			isSelected: this.isSelected,
			screenX: this.screenX,
			screenY: this.screenY,
			gid: this.gid,
			that: this
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
	update(dxdy, dt, rect){
		if(!this.isAlive) return;
		this.screenX += dxdy.dx;
		this.screenY += dxdy.dy;

		if (rect == undefined) return;
		if (this.screenX >= rect.x
            && this.screenX <= rect.x + rect.w
			&& this.screenY >= rect.y
            && this.screenY <= rect.y + rect.h) {
            this.isSelected = true;
            Selector.selectedEntities.push(this);
        }else {
            this.isSelected = false;
        }
	}

}

/* a map between a class name a function
that creates new instances of that class */
Entity._factory = {};

/* @static */
Entity.id = 0;

// A list containing all the entities of the game
Entity.entities = [];

// A dictionary containing the map between the class name 
// and its factory function
Entity.entityFactory = {};
