/**
 * An entity is anything besides background tiles.
 * The entity class is a base class for other classes.
 * Examples of Entities are: units, items, fringe, rocks, houses...
 * Background tiles are not considered Entities.
 */
class Entity extends GameObject{

    constructor(screenX, screenY, gid)
    {
        super();

        this._id = Entity.id++;
        this._gid = gid;

        // the x,y coordinates in the screen
        this._screenX = screenX;
        this._screenY = screenY;

        // whether the entity is alive
        this._isAlive = true;

        // whether this entity can be walked over
        // e.g. like doors or bridge or whatever else
        this._isWalkable = false;

        // the physics body that describes the entity
        this._body = null;

        /** Selection */
        // whether it is selectable, i.e. it can be selected
        this._isSelectable = false;

        // is it selected now
        this._isSelected = false;

        // describes the shape to draw if selected
        this._shape = null;

        var that = this;
        this.on('leftclick', function (e) {
            if (!that.isSelectable()) return;
            var wasSelected = that._isSelected;
            that._isSelected = that._body.containsPoint(e.clientX, e.clientY);
            if (that._isSelected)
                that.select();
            else if (wasSelected)
                that.deSelect();
        });

        this.on('multiselect', function (rect) {
            if (!that.isSelectable()) return;
            var wasSelected = that._isSelected;
            that._isSelected = rect.overlap(that._body);
            if (that._isSelected)
                that.select();
            else if (wasSelected)
                that.deSelect();
        });

        // add it to the list of the entities
        JIVE.Entities.push(this);
    }

    getID()
    {
        return this._id;
    }

    getGid()
    {
        return this._gid;
    }

    getScreenX()
    {
        return this._screenX;
    }

    getScreenY()
    {
        return this._screenY;
    }

    getBody()
    {
        return this._body;
    }

    isAlive()
    {
        return this._isAlive;
    }

    getShape()
    {
        return this._shape;
    }

    setBody(shape)
    {
        this._body = shape;
    }

    setSelectable(isSelectable)
    {
        this._isSelectable = isSelectable;
    }

    setWalkable(isWalkable){
        this._isWalkable = isWalkable;
    }

    enableSelectable(shape)
    {
        this._isSelectable = true;
        this._shape = shape;
    }

    // the method that is called on every frame to update the entity
    update(dx, dy, dt)
    {
        if (!this._isAlive) return;
        this._screenX += dx;
        this._screenY += dy;

        // update the body that describes the physics of this entity
        this._body.setPos(this._screenX, this._screenY);

        // update the position of the selection shape
        if (this._isSelectable && this._isSelected){
            this._shape.setPos(this._screenX, this._screenY);
        }
    }

    getTilePos()
    {
        return Utils.screen2MapCoords({
            clientX: this._screenX + 32,
            clientY: this._screenY + 40
        }, JIVE.Camera);
    }

    // whether this entity can be walked over
    // e.g. like doors or bridge or whatever else
    isWalkable()
    {
        return this._isWalkable
    }

    // whether this entity can be selected
    isSelectable()
    {
        return this._isSelectable;
    }

    // whether this entity is currently selected
    isSelected()
    {
        return this._isSelected;
    }

    // the shape to draw when an entity is selected
    getSelectionShape()
    {
        return this._shape;
    }

    // selects this entity
    select()
    {
        if (!this._isSelectable) return;
        Selector.addSelected(this);
    }

    // deselects this entity
    deSelect()
    {
        if (!this._isSelectable) return;
        Selector.removeDeselected(this);
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