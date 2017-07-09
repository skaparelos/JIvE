/**
 * The unit class represents things that can move.
 * e.g. a player
 */

class Unit extends Entity {


    constructor(screenX, screenY, gid) {

        super(screenX, screenY, gid);

        this.speed = 0.5;
        this.life = 100;
        this.shape = new Ellipse(screenX, screenY, 12, 15, 33, 40);
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);
        this.setWalkable(false);
    }

    update(dxdy, dt) {
        super.update(dxdy, dt);
        this.body.update(this.screenX + 26, this.screenY + 9);
        this.shape.setPos(this.screenX, this.screenY);
    }

    getShape() {
        return this.shape;
    }

}


Entity._factory["Unit"] = function (x, y, gid) {
    return new Unit(x, y, gid);
};