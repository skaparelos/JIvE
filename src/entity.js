/**
 * An entity is anything besides background tiles.
 * The entity class is a base class for other classes.
 * Examples of Entities are: units, items, fringe, rocks, houses...
 * Background tiles are not considered Entities.
 */

class Entity extends EventEmitter{


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

        // if it has been selected by the user
        this.isSelectable = true;
        this.selected = false;

        this.curPt = null;
        this.isMoving = false;
        this.goToPt = null;
        this.nextPt = null;
        this.path = null;

        // todo maybe remove the hardcoded values
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

        JIVE.Entities.push(this);

        var that = this;

        this.on('leftclick', function (e) {
            that.selected = that.body.containsPoint(e.clientX, e.clientY);
            if (that.selected)
                that.select();
            else
                that.deSelect();
        });

        this.on('multiselect', function (rect) {
            that.selected = rect.containsPoint(that.body.x, that.body.y);
            if (that.selected)
                that.select();
            else
                that.deSelect();
        });

        this.direction = 5;

        return this;
    }

    select(){
        if (!this.isSelectable) return;
        this.selected = true;
        if (Selector.selectedEntities.indexOf(this) === -1)
            Selector.selectedEntities.push(this);
    }

    deSelect(){
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

    printPath(){
        for (var pt in this.path){
            console.log('x: ' + this.path[pt].y + ', y: ' + this.path[pt].x);
        }
        console.log("----- end of path --- ");
    }

    goTo(e) {
        var startMapPt = this.getTilePos();
        if (startMapPt === -1) return -1;
        console.log("start: x: " + startMapPt.tileX + ", y: " + startMapPt.tileY);
        console.log("screenX: " + this.screenX + ", screenY: " + this.screenY);
        var pt = Utils.screen2MapCoords(e, JIVE.Camera);
        this.gotoMapPt = new Point(pt.tileX, pt.tileY);
        this.path = Pathfinding.findPath(new Point(startMapPt.tileX, startMapPt.tileY), this.gotoMapPt);
        this.isMoving = true;
        this.printPath();
        // y for x, x for y
        this.nextPt = new Point(this.path[0].y, this.path[0].x);
        console.log("x: " + this.nextPt.x + ", y: " + this.nextPt.y);
        this.distanceLeft = 32;
        //this.direction = Utils.wrapDirection(Math.round(this.direction), this.directions);
        //this.GOTOPTscrn = Utils.map2ScreenCoords(this.GOTOPT.y, this.GOTOPT.x, 64, 64, JIVE.Camera);

        this.speed = 40;
        this.movement = 1;
        this.findDirection();
    }


    setWalkable(w) {
        this.isWalkable = w;
        return this;
    }


    findDirection(){

        // TODO the result of this destroys my path finding!!
        var curMapPt = Utils.screen2MapCoords({clientX: this.screenX + 32, clientY: this.screenY + 40}, JIVE.Camera);
        curMapPt = new Point(curMapPt.tileX, curMapPt.tileY);

        this.dxMove = 0;
        this.dyMove = 0;

        //1
        if (this.nextPt.x == curMapPt.x - 1 && this.nextPt.y == curMapPt.y - 1){
            this.dyMove = -this.movement;
        }

        //2
        if (this.nextPt.x == curMapPt.x  && this.nextPt.y == curMapPt.y - 1) {
            this.dyMove = -this.movement/2;
            this.dxMove = this.movement;
        }

        //3
        if (this.nextPt.x == curMapPt.x + 1 && this.nextPt.y == curMapPt.y - 1){
            this.dxMove = this.movement;
        }

        //4
        if (this.nextPt.x == curMapPt.x + 1 && this.nextPt.y == curMapPt.y){
            this.dyMove = this.movement/2;
            this.dxMove = this.movement;
        }

        //5
        if (this.nextPt.x == curMapPt.x + 1 && this.nextPt.y == curMapPt.y + 1){
            this.dyMove = this.movement;
        }

        //6
        if (this.nextPt.x == curMapPt.x && this.nextPt.y == curMapPt.y + 1){
            this.dyMove = this.movement/2;
            this.dxMove = -this.movement;
        }

        //7
        if (this.nextPt.x == curMapPt.x - 1  && this.nextPt.y == curMapPt.y + 1){
            this.dxMove = -this.movement;
        }

        //8
        if (this.nextPt.x == curMapPt.x - 1  && this.nextPt.y == curMapPt.y){
            this.dyMove = -this.movement/2;
            this.dxMove = -this.movement;
        }

    }


    /**
     * called every frame to update the entity
     */
    update(dxdy, dt) {
        if (!this.isAlive) return;
        this.screenX += dxdy.dx;
        this.screenY += dxdy.dy;
        this.body = new Rectangle(this.screenX + 26, this.screenY + 9, 15, 39);

        if (!this.isMoving) return;

        this.screenX += this.dxMove;
        this.screenY += this.dyMove;
        this.distanceLeft -= this.movement;

        //if (this.nextPt.equal(curMapPt) || this.distanceLeft <= 0){
        if (this.distanceLeft <= 0){
            this.path.shift();
            if (this.path.length === 0) {
                this.isMoving = false;
                return;
            }
            // y for x, x for y
            this.nextPt = new Point(this.path[0].y, this.path[0].x);
            this.findDirection();
            this.distanceLeft = 32;
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
