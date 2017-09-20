/**
 * An entity is anything besides background tiles.
 * The entity class is a base class for other classes.
 * Examples of Entities are: units, items, fringe, rocks, houses...
 * Background tiles are not considered Entities.
 */

class Entity extends GameObject {


    constructor(screenX, screenY, gid)
    {

        super();

        this.id = Entity.id++;
        this.gid = gid;

        // the x,y coordinates in the screen
        this.screenX = screenX;
        this.screenY = screenY;

        // whether the entity is alive
        this.isAlive = true;

        // whether this entity can be walked over
        // e.g. like doors or bridge or whatever else
        this.isWalkable = false;

        // the physics body that describes the entity
        this.body = null;

        /** Selection */
        // whether it is selectable, i.e. it can be selected
        this.isSelectable = false;

        // if isSelectable is true, this holds the selectable object
        // on how to be selected
        this.selectable = null;

        this.selected = false;

        // describes the shape to draw if selected
        this.shape = null;

        /** Pathfinding */
        // whether it can move
        this.isMovable = false;

        // if isMovable is true, this holds the movable object
        // on how to move
        this.movable = null;

        // add it to the list of the entities
        JIVE.Entities.push(this);
        return this;
    }


    setBody(body)
    {
        this.body = body;
    }


    implementsSelectable(shape)
    {
        this.isSelectable = true;
        this.selectable = new Selectable(this);
        this.shape = shape;
    }


    implementsMovable(speed)
    {
        this.isMovable = true;
        this.movable = new Movable(this, speed)
    }


    select()
    {
        if (!this.isSelectable) return;
        this.selectable.setSelected(true);
        Selector.addSelected(this);
    }


    deSelect()
    {
        if (!this.isSelectable) return;
        this.selectable.setSelected(false);
        Selector.removeDeselected(this);
    }


    isSelected()
    {
        if (!this.isSelectable) return false;
        return this.selectable.isSelected();
    }

    getShape(){
        return this.shape;
    }

    getTilePos()
    {
        return Utils.screen2MapCoords({
            clientX: this.screenX + 32,
            clientY: this.screenY + 40
        }, JIVE.Camera);
    }


    getPathToDestination()
    {
        if (this.isMovable)
            return this.movable.getPath();
    }


    goTo(e)
    {
        if (this.isMovable)
            this.movable.goTo(e);
    }


    setWalkable(w) {
        this.isWalkable = w;
        return this;
    }

    getMovable(){
        return this.isMovable;
    }


    /**
     * called every frame to update the entity
     */
    update(dx, dy, dt) {
        if (!this.isAlive) return;
        this.screenX += dx;
        this.screenY += dy;

        if (this.isMovable){
            this.movable.update();
        }

        // update the body that describes the physics of this entity
        this.body.setPos(this.screenX, this.screenY);

        if (this.isSelectable){
            this.shape.setPos(this.screenX, this.screenY);
        }

    }
}

Entity.id = 0;
/* a map between a class name and a function
 that creates new instances of that class */
Entity._factory = {};

if (typeof JIVE === "undefined")
    var JIVE = {};
// A list containing all the Entities of the game
JIVE.Entities = [];
