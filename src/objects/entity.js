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
        this.selectable = new Selectable(this);


        // -- Pathfinding --

        // whether it can move
        this.isMovable = true;
        this.movable = new Movable(this);

        return this;
    }


    select() {
        if (!this.isSelectable) return;
        this.selectable.setSelected(true);
        if (Selector.selectedEntities.indexOf(this) === -1)
            Selector.selectedEntities.push(this);
    }


    deSelect() {
        if (!this.isSelectable) return;
        this.selectable.setSelected(false);
        var index = Selector.selectedEntities.indexOf(this);
        if (index > -1)
            Selector.selectedEntities.splice(index, 1);
    }


    setSelectable(s){
        this.isSelectable = s;
        return this;
    }


    isSelected() {
        if (!this.isSelectable) return false;
        return this.selectable.isSelected();
    }


    getTilePos() {
        return Utils.screen2MapCoords({
            clientX: this.screenX + 32,
            clientY: this.screenY + 40
        }, JIVE.Camera);
    }


    printPath() {
        if (this.isMovable)
            this.movable.printPath();
    }

    getPathToDestination(){
        if (this.isMovable)
            return this.movable.getPath();
    }


    goTo(e) {
        if (this.isMovable)
            this.movable.goTo(e);
    }


    setWalkable(w) {
        this.isWalkable = w;
        return this;
    }

    setMovable(m){
        this.isMovable = m;
        return this;
    }

    getMovable(){
        return this.isMovable;
    }


    /**
     * called every frame to update the entity
     */
    update(dxdy, dt) {
        if (!this.isAlive) return;
        this.screenX += dxdy.dx;
        this.screenY += dxdy.dy;

        if (this.isMovable){
            this.movable.update();
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
