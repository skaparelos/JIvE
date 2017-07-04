/**
* An entity is anything besides background tiles.
* The entity class is a base class for other classes.
* Examples of Entities are: units, items, fringe, rocks, houses...
* Background tiles are not considered Entities.
*/

class Entity{


	constructor(screenX, screenY, gid){

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
		this.isSelectable = true;
		this.isSelected = false;

		// todo maybe remove the hardcoded values
		this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

        // takes the class name and adds it to a dictionary
        // so we can create new objects on the fly by evaluating
        // the class name
        /*var subClassName = this.__proto__.constructor.name;
        if(Entity._factory[subClassName] === null
			&& subClassName !== "Entity") {
			Entity._factory[subClassName] = function (x, y, gid) {
                var o = eval("new " + subClassName + "(" + x + "," + y + "," + gid + ");");
                return o;
            }
        }*/

        JIVE.Entities.push(this);

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
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

		if (!this.isSelectable || rect === undefined) return;
		// todo fix that for overlapping
		if (rect.containsPoint(this.screenX, this.screenY) || (rect.w === 0 && this.body.containsPoint(rect.x, rect.y))){
            this.isSelected = true;

            // add the item in the list of the selected items only if it doesn't exist
            if(Selector.selectedEntities.indexOf(this) === -1)
            	Selector.selectedEntities.push(this);
        }else {
            this.isSelected = false;

            // see if the item is in the selected items list and if it is, remove it
            var index = Selector.selectedEntities.indexOf(this);
            if (index > -1) {
                Selector.selectedEntities.splice(index, 1);
            }
        }
	}

}

/* a map between a class name and a function
that creates new instances of that class */
Entity._factory = {};

Entity.id = 0;

if(typeof JIVE === "undefined")
    var JIVE = {};
// A list containing all the Entities of the game
JIVE.Entities = [];
