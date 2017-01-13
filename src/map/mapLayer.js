/**
 * A map layer represents a layer. e.g. background is one layer,
 * non-moving objects can be a second layer (e.g. buildings and trees),
 * sprites might be a third layer. etc..
 *
 * Note: all mapLayers must have the same dimensions. Dimensions are available
 * from Map class (since they are all the same)
 */
class MapLayer{

    constructor() {

        // this is a 2D array, where each cell holds a reference to an object
        // of the MapCell class
        this._map = []
    }


    createEmptyLayer(mapWidth, mapHeight, type = undefined){
        if (type === undefined)
            type = MapCell.TYPES.WALKABLE_NON_EMPTY;

        for (var i = 0; i < mapHeight; i++) {
            this._map[i] = [];

            for (var j = 0; j < mapWidth; j++) {
                this._map[i][j] = new MapCell(type, g_black_white_tile)
            }

        }
    }


    getCell(row, col){
        return this._map[row][col].getMapCell();
    }


    getLayerMap(){
        return this._map;
    }


    setCell(row, col, type, worldObjectID){
        this._map[row][col].setMapCell(type, worldObjectID)
    }


    clear(){
        this._map = []
    }

}