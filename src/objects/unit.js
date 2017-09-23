/**
 * The unit class represents things that can move.
 * e.g. a player
 */

class Unit extends MovingEntity {

    constructor(screenX, screenY, gid) {
        super(screenX, screenY, gid);

        this.__gidsPtr = 0;
        this.__gids = [33, 31, 30, 32, 35];
        this.__prevAnim = new Date().getTime();

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

    animate() {
        var now = new Date().getTime();
        if (now - this.__prevAnim > 300) {
            this.__gidsPtr += 1;
            this.__gidsPtr = this.__gidsPtr % this.__gids.length;
            this.__prevAnim = now;
        }
    }

    update(dx, dy, dt) {
        this.animate();
        super.update(dx, dy, dt);
    }

    getGid() {
        return this.__gids[this.__gidsPtr];
    }
}


Entity._factory["Unit"] = function (x, y, gid) {
    return new Unit(x, y, gid);
};