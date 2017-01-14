/**
 *  A map cell represents the contents of each cell in a map
 */
class MapCell{

    constructor(type = 0, worldObjectId = null){

        // see type analysis below (look for MapCell.TYPES)
        this._type = type;

        // the reason that this is an ID, is because it is easier to deal with JSON.
        // if it was holding an object reference, JSON would unroll all the details of the object.
        // Keep things simple.
        this._worldObjectId = worldObjectId;
    }


    setMapCell(type, worldObjectId){
        this._type = type;
        this._worldObjectId = worldObjectId
    }


    getMapCell(){
        return {
            type: this._type,
            worldObjectId: this._worldObjectId
        }
    }


    getWorldObjectId(){
        return this._worldObjectId
    }



}

MapCell.TYPES = {

    // all empty are walkable
    EMPTY: 0,

    // contains something that can be walked over. e.g. a background tile, or
    // coin to take or door to go through
    WALKABLE_NON_EMPTY : 1,

    // non walkable contains sth like house or tree
    NON_WALKABLE : 2,

    // contain a sprite
    SPRITE : 3
};