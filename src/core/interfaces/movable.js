class Movable {

    constructor(object, speed)
    {

        this.object = object;

        // a boolean indicating whether the player is moving now or not
        this.isMoving = false;

        // the speed of movement
        this.speed = speed || 40;

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
    }


    update()
    {
        if (!this.isMoving) return;

        this.object.screenX += this.dxMove;
        this.object.screenY += this.dyMove;

        this.distanceLeft -= this.movement;

        // if final destination has been reached stop moving;
        // if next point in the path has been reach set the next one to visit
        // and calculate how to go there
        if (this.nextMapPt.equal(this.curMapPt) || this.distanceLeft <= 0)
        {
            this.path.shift();
            if (this.path.length === 0)
            {
                this.isMoving = false;
                return;
            }
            // y for x, x for y
            this.nextMapPt = new Point(this.path[0].y, this.path[0].x);
            this.findDirection(this.object.getTilePos(), this.nextMapPt);
        }
    }

    // go to event position
    // translates the event position to world coordinates and
    // finds the path to go there;
    // starts the process of moving
    goTo(e)
    {
        this.curMapPt = this.object.getTilePos();
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
            console.log("start: x: " + this.curMapPt.tileX + ", y: " +
                this.curMapPt.tileY);
            console.log("screenX: " + this.object.screenX + ", screenY: " +
                this.object.screenY);
            this.printPath();
            console.log("x: " + this.nextMapPt.x + ", y: " + this.nextMapPt.y);
        }

        this.findDirection(this.curMapPt, this.nextMapPt);
        this.isMoving = true;
    }


    findDirection(curMapPt, nextMapPt)
    {

        if (curMapPt === -1) return;

        curMapPt = new Point(curMapPt.tileX, curMapPt.tileY);
        this.curMapPt = curMapPt;

        this.dxMove = 0;
        this.dyMove = 0;
        this.distanceLeft = JIVE.settings.unitTileWidth/2;
        this.direction = 0;

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
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y - 1)
        {
            this.dyMove = -this.movement;
            this.direction = 1;
        }

        //2
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y - 1)
        {
            this.dyMove = -this.movement / 2;
            this.dxMove = this.movement;
            this.direction = 2;
        }

        //3
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y - 1)
        {
            this.dxMove = this.movement;
            this.distanceLeft *= 2;
            this.direction = 3;
        }

        //4
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y)
        {
            this.dyMove = this.movement / 2;
            this.dxMove = this.movement;
            this.direction = 4;
        }

        //5
        if (nextMapPt.x === curMapPt.x + 1 && nextMapPt.y === curMapPt.y + 1)
        {
            this.dyMove = this.movement;
            this.direction = 5;
        }

        //6
        if (nextMapPt.x === curMapPt.x && nextMapPt.y === curMapPt.y + 1)
        {
            this.dyMove = this.movement / 2;
            this.dxMove = -this.movement;
            this.direction = 6;
        }

        //7
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y + 1)
        {
            this.dxMove = -this.movement;
            this.distanceLeft *= 2;
            this.direction = 7;
        }

        //8
        if (nextMapPt.x === curMapPt.x - 1 && nextMapPt.y === curMapPt.y)
        {
            this.dyMove = -this.movement / 2;
            this.dxMove = -this.movement;
            this.direction = 8;
        }
    }


    printPath()
    {
        for (var pt in this.path) {
            console.log('x: ' + this.path[pt].y + ', y: ' + this.path[pt].x);
        }
        console.log("----- end of path --- ");
    }

    getPath()
    {
        return this.path;
    }

}