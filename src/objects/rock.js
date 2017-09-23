/**
 * The unit class represents things that can move.
 * e.g. a player
 */

class Rock extends Entity {

    constructor(screenX, screenY, gid) {
        super(screenX, screenY, gid);

        this.life = 100;

        var body = new Rhombus(this.screenX, this.screenY);
        this.setBody(body);

        //var shape = new Rhombus(screenX, screenY);
        //this.enableSelectable(shape);
    }
}


Entity._factory["Rock"] = function (x, y, gid) {
    return new Rock(x, y, gid);
};