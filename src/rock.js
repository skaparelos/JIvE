/**
 * The unit class represents things that can move.
 * e.g. a player
 */

class Rock extends Entity {


    constructor(screenX, screenY, gid) {

        super(screenX, screenY, gid);

        this.speed = 0;
        this.life = 100;
        this.shape = new Rhombus(screenX, screenY);
        //this.body = new Rectangle(this.screenX, this.screenY, 64, 64);
        this.body = new Rhombus(this.screenX, this.screenY);
        this.setWalkable(false);
        this.setSelectable(false);
    }

    update(dxdy, dt) {
        super.update(dxdy, dt);
        this.body.update(this.screenX, this.screenY);
        this.shape.update(this.screenX, this.screenY);
    }

    getShape() {
        return this.shape;
    }

}


Entity._factory["Rock"] = function (x, y, gid) {
    return new Rock(x, y, gid);
};