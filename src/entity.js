/**
 * An entity is anything besides background tiles.
 * The entity class is a base class for other classes.
 * Examples of Entities are: units, items, fringe, rocks, houses...
 * Background tiles are not considered Entities.
 */

class Entity extends EventEmitter {


    constructor(screenX, screenY, gid) {

        super();

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

        // todo remove the hardcoded values
        this.body = null;

        JIVE.Entities.push(this);

        // -- Selection --

        // indicates whether it is selectable
        this.isSelectable = true;

        // if selected by the user
        this.selected = false;
        var that = this;

        this.on('leftclick', function (e) {
            if (!that.isSelectable) return;
            that.selected = that.body.containsPoint(e.clientX, e.clientY);
            if (that.selected)
                that.select();
            else
                that.deSelect();
        });

        this.on('multiselect', function (rect) {
            if (!that.isSelectable) return;
            that.selected = rect.containsPoint(that.body.x, that.body.y);
            if (that.selected)
                that.select();
            else
                that.deSelect();
        });


        // -- Pathfinding --

        // whether it can move
        this.movable = true;

        // a boolean indicating whether the player is moving or not
        this.isMoving = false;

        // the speed of movement
        this.speed = 40;

        // how much to move per frame
        this.movement = this.speed / JIVE.settings.unitTileWidth;

        // the current position of this entity in the 2D map
        this.curMapPt = null;

        // a tile position indicating the target tile to move to
        this.destinationMapPt = null;

        // the next tile position to move to
        this.nextMapPt = null;

        // an array that contains the path of the tiles to go to in order
        // to reach the destination
        this.path = null;

        // the distance left to reach the next map point in pixels
        this.distanceLeft = JIVE.settings.unitTileWidth/2;

        // the displacement to move in each axis for movement
        this.dxMove = 0;
        this.dyMove = 0;

        // there are 8 possible directions to move
        // P is the player in the middle
        // At each moment can move to either one of these 8 directions
        // direction number 0 means no direction
        //    --- --- ---
        //   | 1 | 2 | 3 |
        //    --- --- ---
        //    --- --- ---
        //   | 8 | P | 4 |
        //    --- --- ---
        //    --- --- ---
        //   | 7 | 6 | 5 |
        //    --- --- ---
        this.direction = 0;

        return this;
    }


    select() {
        if (!this.isSelectable) return;
        this.selected = true;
        if (Selector.selectedEntities.indexOf(this) === -1)
            Selector.selectedEntities.push(this);
    }


    deSelect() {
        if (!this.isSelectable) return;
        this.selected = false;
        var index = Selector.selectedEntities.indexOf(this);
        if (index > -1)
            Selector.selectedEntities.splice(index, 1);
    }


    getTilePos() {
        return Utils.screen2MapCoords({
            clientX: this.screenX + 32,
            clientY: this.screenY + 40
        }, JIVE.Camera);
    }


    isSelected() {
        return this.selected;
    }


    printPath() {
        for (var pt in this.path) {
            console.log('x: ' + this.path[pt].y + ', y: ' + this.path[pt].x);
        }
        console.log("----- end of path --- ");
    }


    goTo(e) {
        if (!this.movable) return;
        this.curMapPt = this.getTilePos();
        if (this.curMapPt === -1)
            return;

        var destMapPt = Utils.screen2MapCoords(e, JIVE.Camera);
        this.destinationMapPt = new Point(destMapPt.tileX, destMapPt.tileY);
        this.path = Pathfinding.findPath(
            new Point(this.curMapPt.tileX, this.curMapPt.tileY),
            this.destinationMapPt
            );

        // y for x, x for y
        this.nextMapPt = new Point(this.path[0].y, this.path[0].x);

        if (JIVE.settings.DEBUG) {
            console.log("start: x: " + this.curMapPt.tileX + ", y: " + this.curMapPt.tileY);
            console.log("screenX: " + this.screenX + ", screenY: " + this.screenY);
            this.printPath();
            console.log("x: " + this.nextMapPt.x + ", y: " + this.nextMapPt.y);
        }

        this.findDirection(this.curMapPt, this.nextMapPt);
        this.isMoving = true;
    }

    setSelectable(s){
        this.isSelectable = s;
        return this;
    }

    setWalkable(w) {
        this.isWalkable = w;
        return this;
    }

    setMovable(m){
        this.movable = m;
        return this;
    }

    /**
     *
     */
    findDirection(curMapPt, nextMapPt) {

        if (curMapPt === -1)
            return;

        curMapPt = new Point(curMapPt.tileX, curMapPt.tileY);
        this.curMapPt = curMapPt;

        this.dxMove = 0;
        this.dyMove = 0;
        this.distanceLeft = JIVE.settings.unitTileWidth/2;
        this.direction = 0;

        //1
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y - 1) {
            this.dyMove = -this.movement;
            this.direction = 1;
        }

        //2
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y - 1) {
            this.dyMove = -this.movement / 2;
            this.dxMove = this.movement;
            this.direction = 2;
        }

        //3
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y - 1) {
            this.dxMove = this.movement;
            this.distanceLeft *= 2;
            this.direction = 3;
        }

        //4
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y) {
            this.dyMove = this.movement / 2;
            this.dxMove = this.movement;
            this.direction = 4;
        }

        //5
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y + 1) {
            this.dyMove = this.movement;
            this.direction = 5;
        }

        //6
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y + 1) {
            this.dyMove = this.movement / 2;
            this.dxMove = -this.movement;
            this.direction = 6;
        }

        //7
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y + 1) {
            this.dxMove = -this.movement;
            this.distanceLeft *= 2;
            this.direction = 7;
        }

        //8
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y) {
            this.dyMove = -this.movement / 2;
            this.dxMove = -this.movement;
            this.direction = 8;
        }
    }


    /**
     * called every frame to update the entity
     */
    update(dxdy, dt) {
        if (!this.isAlive) return;
        this.screenX += dxdy.dx;
        this.screenY += dxdy.dy;

        if (!this.isMoving) return;

        this.screenX += this.dxMove;
        this.screenY += this.dyMove;
        this.distanceLeft -= this.movement;

        if (this.nextMapPt.equal(this.curMapPt) || this.distanceLeft <= 0) {
            this.path.shift();
            if (this.path.length === 0) {
                this.isMoving = false;
                return;
            }
            // y for x, x for y
            this.nextMapPt = new Point(this.path[0].y, this.path[0].x);
            this.findDirection(this.getTilePos(), this.nextMapPt);
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
