/**
 * BasicObjects are the finite set of objects that are used to create a or a game
 *
 * For example: in a game we might have 10 blue houses and 20 red houses.
 * We would have two basic objects: one representing the blue house and another
 * one representing the red house.
 *
 * WorldObjects class and its instances are used to create multiple instances
 * of each basic object. So we would have 10 worldObjects representing the blue
 * houses and 20 worldObjects representing the red houses.
 *
 * A basicObject can be a tile, a house, a tree, a unit, etc.
 */
class BasicObject{

	constructor(nickName, tileWidth, tileHeight, walkable = true){
		BasicObject.worldObjects[nickName] = this;
		this._id = BasicObject._id++;

		//TODO this is sth the user must set
		this._nickName = nickName; // tileset's nickname (see configure.js)
		this._walkable = walkable;

		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;

		// The names of the frames associated with this basicObject.
		this._frames = {};
		// TODO currentFrame is sth that worldObjects have
		//this._currentFrame = 0;
	}


	addFrame(frameName){
		this._frames.push(frameName);
	}


	clearFrames(){
		this._frames = {};
	}


	getNickName(){
		return this._nickName;
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


	// TODO do we need row, col ? or access this._tileX, this._tileY?
    draw(spriteSheet, row , col, camX, camY, zoomLevel, screenOffset,
         screenWidth, screenHeight){

        var imgDim = spriteSheet.getFrameDimensions(this._nickName);
        var imgWidth = imgDim.width;
        var imgHeight = imgDim.height;

        var coords = BasicObject.drawingCoords(row, col, imgWidth, imgHeight,
            camX, camY, zoomLevel);

        if (coords.x > 0 - screenOffset &&
            coords.y > 0 - screenOffset &&
            coords.x < screenWidth + screenOffset &&
            coords.y < screenHeight + screenOffset){

            spriteSheet.drawFrame(this._nickName, coords.x, coords.y,
                coords.width, coords.height);
        }
    }


	static load(BasicObjects){
		var objectsJSONed = JSON.parse(BasicObjects);
		for (var object in objectsJSONed){
			var o = objectsJSONed[object];
			new BasicObject(o._nickName, o._drawable, o._layer, o._tileX,
				o._tileY, o._tileWidth, o._tileHeight);
		}
	}


	static exportJSON(){
		if (BasicObject.worldObjects.length == 0) return;
		var jsonified = "var g_worldObjects = '" +
			JSON.stringify(BasicObject.worldObjects) + "';\n";
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
BasicObject._id = 0;
BasicObject.worldObjects = {};
