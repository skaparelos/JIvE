/**
 * WorldObject represents an entity that the user has placed in the map.
 * It can be a tile, a house, a tree, a unit, etc.
 */
class WorldObject{

	constructor(frameName, drawable, layer, tileX, tileY, tileWidth, tileHeight){
		WorldObject.worldObjects[WorldObject._id] = this;
		this._id = WorldObject._id++;

        // frame nickname inside tileset (set in configure.js)
		this._frameName = frameName;
		this._drawable = drawable;
		this._layer = layer;
		this._walkable = true;

		this._tileX = tileX;
		this._tileY = tileY;
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;
	}


	getFrameName(){
		return this._frameName;
	}


	getID(){
		return this._id;
	}


	setWalkable(walkable){
		this._walkabe = walkable;
	}


	getWalkable(){
		return this._walkable;
	}


	isDrawable(){
		return this._drawable;
	}


	setDrawable(drawable){
		this._drawable = drawable;
	}


	// TODO do we need row, col ? or access this._tileX, this._tileY?
    draw(spriteSheet, row , col, camX, camY, zoomLevel, screenOffset,
         screenWidth, screenHeight){

        var imgDim = spriteSheet.getFrameDimensions(this._frameName);
        var imgWidth = imgDim.width;
        var imgHeight = imgDim.height;

        var coords = WorldObject.drawingCoords(row, col, imgWidth, imgHeight,
            camX, camY, zoomLevel);

        if (coords.x > 0 - screenOffset &&
            coords.y > 0 - screenOffset &&
            coords.x < screenWidth + screenOffset &&
            coords.y < screenHeight + screenOffset){

            spriteSheet.drawFrame(this._frameName, coords.x, coords.y,
                coords.width, coords.height);
        }
    }


	static load(worldObjects){
		var objectsJSONed = JSON.parse(worldObjects)

		for (var object in objectsJSONed){
			var o = objectsJSONed[object];
			new WorldObject(o._frameName, o._drawable, o._layer, o._tileX, o._tileY,
				o._tileWidth, o._tileHeight);
		}
	}


	static exportJSON(){
		if (WorldObject.worldObjects.length == 0) return;
		var jsonified = "var g_worldObjects = '" + JSON.stringify(WorldObject.worldObjects) + "';\n";
		return jsonified;
	}


	/**
     * Calculates the drawing coordinates of an image given the tile position
     * (i.e. row, col), the image width & height, as well as the camera position
     * and the zoom level.
     *
     * TODO optimise this is called extremely often!!
     * TODO this is called for N layers and recalculates the same thing
     * need to optimise this to be called once for all layers since the result
     * is the same
     *
     * @param row
     * @param col
     * @param imgWidth
     * @param imgHeight
     * @param camX
     * @param camY
     * @param zoomLevel
     * @returns {{x: *, y: *, width: number, height: number}}
     * @private
     */
    static drawingCoords(row, col, imgWidth, imgHeight, camX, camY, zoomLevel){

        // Map to screen coords conversion
        var initX = (col - row) * g_unit_tile_width / 2;
        var initY = (row + col) * g_unit_tile_height / 2;

        // adjust screen coordinates based on zoom level and camera position
        var screenX = initX / zoomLevel + camX;
        var screenY = initY / zoomLevel + camY;

        // calculate the new tile width & height based on the zoom level
        var widthZoom  = Math.floor(imgWidth / zoomLevel);
        var heightZoom = Math.floor(imgHeight / zoomLevel);

        // make these two adjustments to position the image correctly
        // (this is to correctly draw any image in the center of the tile)
        screenX = Math.floor(screenX - imgWidth / (zoomLevel * 2)
            + g_unit_tile_width / (zoomLevel * 2));
        screenY = Math.floor(screenY - imgHeight / zoomLevel
            + g_unit_tile_height / zoomLevel);

        return{
            x: screenX,
            y: screenY,
            width: widthZoom,
            height: heightZoom
        }
    }
}


// Static
WorldObject._id = 0;
WorldObject.worldObjects = {};
