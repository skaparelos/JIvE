/**
* The unit class represents things that can move.
* e.g. a player
*/

class Unit extends Entity{


	constructor(screenX, screenY, gid){

		super(screenX, screenY, gid);

		this.speed = 0.5;
		this.life = 100;
		this.shape = new Ellipse(screenX, screenY, 12, 15, 33, 40);
		this.setWalkable(false);

		JIVE.entities.push(this);
	}

	update(dxdy, dt){
		super.update(dxdy, dt);
		this.shape.setPos(this.screenX, this.screenY);
	}

	getShape(){
		return this.shape;
	}

}


JIVE._unitFactory = function(x, y, gid){
	return new Unit(x, y, gid);
}
JIVE.entityFactory["unit"] = JIVE._unitFactory;