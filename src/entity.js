/**
 * An entity is anything besides background tiles.
 * The entity class is a base class for other classes.
 * Examples of Entities are: units, items, fringe, rocks, houses...
 * Background tiles are not considered Entities.
 */

class Entity {


    constructor(screenX, screenY, gid) {

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

        this.curPt = null;
        this.isMoving = false;
        this.goToPt = null;
        this.nextPt = null;
        this.path = null;

        // todo maybe remove the hardcoded values
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

        JIVE.Entities.push(this);

        this.direction = 5;

        return this;
    }

    getTilePos() {
        return Utils.screen2MapCoords({
            clientX: this.screenX,
            clientY: this.screenY
        }, JIVE.Camera);
    }

    isSelected() {
        return this.isSelected;
    }

    moveTo(end) {
        var start = this.getTilePos();
        if (start === -1) return -1;
        this.path = Pathfinding.findPath(new Point(start.tileX, start.tileY), end);
        this.path.shift();
        this.goToPt = end;
        this.isMoving = true;
        this.nextPt = new Point(this.path[1].x, this.path[1].y);
        this.curPt = new Point(start.x, start.y);
    }

    goTo(e) {
        var pt = Utils.screen2MapCoords(e, JIVE.Camera);
        this.GOTOPT = new Point(pt.tileX, pt.tileY);
        this.isMoving = true;
        this.direction = Utils.wrapDirection(Math.round(this.direction), this.directions);
        this.GOTOPTscrn = Utils.map2ScreenCoords(this.GOTOPT.y, this.GOTOPT.x, 64, 64, JIVE.Camera);
    }


    setWalkable(w) {
        this.isWalkable = w;
        return this;
    }


    getEntity() {
        return {
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
    move(dx, dy, camera) {
        if (!this.isAlive || !this.isWalkable) return;

        return this;
    }


    /**
     * called every frame to update the entity
     */
    update(dxdy, dt, rect) {
        if (!this.isAlive) return;
        this.screenX += dxdy.dx;
        this.screenY += dxdy.dy;
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

        // selector
        if (!this.isSelectable || rect === undefined) return;
        // todo fix that for overlapping
        if (rect.containsPoint(this.screenX, this.screenY) || (rect.w === 0 && this.body.containsPoint(rect.x, rect.y))) {
            this.isSelected = true;

            // add the item in the list of the selected items only if it doesn't exist
            if (Selector.selectedEntities.indexOf(this) === -1)
                Selector.selectedEntities.push(this);
        } else {
            this.isSelected = false;

            // see if the item is in the selected items list and if it is, remove it
            var index = Selector.selectedEntities.indexOf(this);
            if (index > -1) {
                Selector.selectedEntities.splice(index, 1);
            }
        }

        /*
        // pathfinding
        if (!this.isMoving || !this.curPt) return;

        // get latest curPt in tile coords
        var e = {clientX: this.screenX + 30, clientY: this.screenY + 30};
        var pos = Utils.screen2MapCoords(e, JIVE.Camera);
        if (pos !== -1)
            this.curPt.update(pos.tileX + 1, pos.tileY + 1);

        // if has reached destination
        if (this.curPt.equal(this.goToPt)) {
            this.isMoving = false;
            this.curPt = null;
            this.goToPt = null;
            this.path = null;
        }

        // if has reached next point
        if (this.curPt.equal(this.nextPt)) {
            this.path.shift();
            this.nextPt = new Point(this.path[0].x, this.path[0].y);
        }
        var nextPtScrnPt = Utils.map2ScreenCoords(this.nextPt.y, this.nextPt.x, 64, 64, JIVE.Camera);

        var scrnPt = new Point(this.screenX, this.screenY);


         var distance = scrnPt.distance(nextPtScrnPt);
         console.log(scrnPt.angleDeg(nextPtScrnPt));
         var differenceX = Math.abs(nextPtScrnPt.x - this.screenX);
         if (nextPtScrnPt.x <= this.screenX)
         differenceX *= -1;

         var differenceY = Math.abs(nextPtScrnPt.y - this.screenY);
         if (nextPtScrnPt.y <= this.screenY)
         differenceY *= -1;

         this.screenX += differenceX/60*0.83;
         this.screenY += differenceY/60*0.83;*/


        if (!this.isMoving) return;
        var scrnPt = new Point(this.screenX, this.screenY);
        this.directions = 8;
        this.turnSpeed = 4;
        this.speed = 40;


        // Find out where we need to turn to get to destination
        var newDirection = Utils.findAngle(this.GOTOPTscrn, scrnPt, this.directions);

        // Calculate difference between new direction and current direction
        var difference = Utils.angleDiff(this.direction, newDirection, this.directions);

        // Calculate amount that aircraft can turn per animation cycle
        var turnAmount = this.turnSpeed/8;
        if (Math.abs(difference) > turnAmount){
            this.direction = Utils.wrapDirection(this.direction + turnAmount * Math.abs(difference)/difference, this.directions);
        } else {
            // Calculate distance that aircraft can move per animation cycle
            var movement = this.speed /64;
            // Calculate x and y components of the movement
            var angleRadians = -(Math.round(this.direction)/this.directions)*2*Math.PI ;
            this.lastMovementX = - (movement*Math.sin(angleRadians));
            this.lastMovementY = - (movement*Math.cos(angleRadians));
            this.screenX += this.lastMovementX;
            this.screenY += this.lastMovementY;

            if (Math.abs(this.screenY - this.GOTOPTscrn.y) < 1 &&
                Math.abs(this.screenX - this.GOTOPTscrn.x) < 1)
                    this.isMoving = false;

        }



    }

}

/* a map between a class name and a function
 that creates new instances of that class */
Entity._factory = {};

Entity.id = 0;

if (typeof JIVE === "undefined")
    var JIVE = {};
// A list containing all the Entities of the game
JIVE.Entities = [];
