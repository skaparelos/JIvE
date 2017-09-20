/**
 * The unit class represents things that can move.
 * e.g. a player
 */

class Unit extends MovingEntity {
    
    constructor(screenX, screenY, gid)
    {
        super(screenX, screenY, gid);

        this.life = 100;

        var body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39, 26, 9);
        this.setBody(body);

        // cannot be walked over by other entities
        this.setWalkable(false);

        var shape = new Ellipse(screenX, screenY, 12, 15, 33, 40);
        this.enableSelectable(shape);

        //this.speed = 40;
        //this.implementsMovable(this.speed);
    }
}


Entity._factory["Unit"] = function (x, y, gid) {
    return new Unit(x, y, gid);
};