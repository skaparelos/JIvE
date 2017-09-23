/** Abstract class with default implementation */
class MovingEntity extends Entity {

    constructor(screenX, screenY, gid, camera, map) {
        super(screenX, screenY, gid, camera, map);

        // a boolean indicating whether the player is moving now or not
        this._isMoving = false;

        // the speed of movement
        this._speed = 40;

        // how much to move per frame
        this._movement = this._speed / JIVE.settings.unitTileWidth;

        // the current position of this entity in the 2D map
        this._curMapPt = null;

        // a tile position indicating the target tile to move to
        this._destinationMapPt = null;

        // the next tile position to move to
        this._nextMapPt = null;

        // an array that contains the path of the tiles to go to in order
        // to reach the destination
        this._path = null;

        // the distance left to reach the next map point in pixels
        this._distanceLeft = JIVE.settings.unitTileWidth / 2;

        // the displacement to move in each axis for movement
        this._dxMove = 0;
        this._dyMove = 0;

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
        this._direction = 0;


        var that = this;
        this.on('click-right', function (e) {
            if (that.isSelected())
                that.goTo(e);
        });
    }

    isMoving() {
        return this._isMoving;
    }

    update(dx, dy, dt) {
        super.update(dx, dy, dt);
        if (!this._isMoving) return;

        this._screenX += this._dxMove;
        this._screenY += this._dyMove;

        this._distanceLeft -= this._movement;

        // if final destination has been reached stop moving;
        // if next point in the path has been reach set the next one to visit
        // and calculate how to go there
        if (this._nextMapPt.equal(this._curMapPt) || this._distanceLeft <= 0) {
            this._path.shift();
            if (this._path.length === 0) {
                this._isMoving = false;
                return;
            }
            // y for x, x for y
            this._nextMapPt = new Point(this._path[0].y, this._path[0].x);
            this.findDirection(this.getTilePos(), this._nextMapPt);
        }
    }

    setSpeed(speed) {
        this._speed = speed;
    }

    // indicate where to go, given a screen event.
    // go to event position
    // translates the event position to world coordinates and
    // finds the path to go there;
    // starts the process of moving
    goTo(e) {
        this._curMapPt = this.getTilePos();
        if (this._curMapPt === -1)
            return;

        var destMapPt = Utils.screen2MapCoords(e, this._camera);
        this._destinationMapPt = new Point(destMapPt.tileX, destMapPt.tileY);
        this._path = Pathfinding.findPath(
            new Point(this._curMapPt.tileX, this._curMapPt.tileY),
            this._destinationMapPt,
            this._map.getWidth(),
            this._map.getHeight()
        );

        // y for x, x for y
        this._nextMapPt = new Point(this._path[0].y, this._path[0].x);

        if (JIVE.settings.DEBUG) {
            console.log("start: x: " + this._curMapPt.tileX + ", y: " +
                this._curMapPt.tileY);
            console.log("screenX: " + this._screenX + ", screenY: " +
                this._screenY);
            this.printPath();
            console.log("x: " + this._nextMapPt.x + ", y: " + this._nextMapPt.y);
        }

        this.findDirection(this._curMapPt, this._nextMapPt);
        this._isMoving = true;
    }


    findDirection(curMapPt, nextMapPt) {

        if (curMapPt === -1) return;

        curMapPt = new Point(curMapPt.tileX, curMapPt.tileY);
        this._curMapPt = curMapPt;

        this._dxMove = 0;
        this._dyMove = 0;
        this._distanceLeft = JIVE.settings.unitTileWidth / 2;
        this._direction = 0;

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

        //1
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y - 1) {
            this._dyMove = -this._movement;
            this._direction = 1;
        }

        //2
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y - 1) {
            this._dyMove = -this._movement / 2;
            this._dxMove = this._movement;
            this._direction = 2;
        }

        //3
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y - 1) {
            this._dxMove = this._movement;
            this._distanceLeft *= 2;
            this._direction = 3;
        }

        //4
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y) {
            this._dyMove = this._movement / 2;
            this._dxMove = this._movement;
            this._direction = 4;
        }

        //5
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y + 1) {
            this._dyMove = this._movement;
            this._direction = 5;
        }

        //6
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y + 1) {
            this._dyMove = this._movement / 2;
            this._dxMove = -this._movement;
            this._direction = 6;
        }

        //7
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y + 1) {
            this._dxMove = -this._movement;
            this._distanceLeft *= 2;
            this._direction = 7;
        }

        //8
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y) {
            this._dyMove = -this._movement / 2;
            this._dxMove = -this._movement;
            this._direction = 8;
        }
    }

    getDirection() {
        return this._direction;
    }

    printPath() {
        for (var pt in this._path) {
            console.log('x: ' + this._path[pt].y + ', y: ' + this._path[pt].x);
        }
        console.log("----- end of path --- ");
    }

    getPathToDestination() {
        return this._path;
    }

}