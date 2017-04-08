class TiledMapRenderer{

	constructor(tiledMap){
		this.tiledMap = tiledMap;
	}


	clearScreen(ctx){
		ctx.clearRect(0, 0, 800, 800);
	}


	draw(imageLoader, ctx){
		this.clearScreen(ctx);

		var map = this.tiledMap.getMap();
		var layersNo = map["layersNo"];
		var mapW = map["mapwidth"];
		var mapH = map["mapheight"];
		var unitTileWidth = this.tiledMap.getTileWidth();
		var unitTileHeight = this.tiledMap.getTileHeight();

		for (var layer = 0; layer < layersNo; layer++){
			for (var h = 0; h < mapH; h++){
				for (var w = 0; w < mapW; w++){
					var gidValue = map["map"][layer][h][w];
					if (gidValue != 0){
						var gid = this.tiledMap.getGID(gidValue);
						var coords = this.drawingCoords(h, w, gid["w"], gid["h"], 300, 100, 1, unitTileWidth, unitTileHeight);
						ctx.drawImage(imageLoader.get(gid["imagename"]), gid["x"], gid["y"], gid["w"], gid["h"], coords.x, coords.y, gid["w"], gid["h"]);
					}
				}
			}
		}
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
	drawingCoords(row, col, imgWidth, imgHeight, camX, camY, zoomLevel, unitTileWidth, unitTileHeight){

		// Map to screen coords conversion
		var initX = (col - row) * unitTileWidth / 2;
		var initY = (row + col) * unitTileHeight / 2;

		// adjust screen coordinates based on zoom level and camera position
		var screenX = initX / zoomLevel + camX;
		var screenY = initY / zoomLevel + camY;

		// calculate the new tile width & height based on the zoom level
		var widthZoom  = Math.floor(imgWidth / zoomLevel);
		var heightZoom = Math.floor(imgHeight / zoomLevel);

		// make these two adjustments to position the image correctly
		// (this is to correctly draw any image in the center of the tile)
		screenX = Math.floor(screenX - imgWidth / (zoomLevel * 2)
			+ unitTileWidth / (zoomLevel * 2));
		screenY = Math.floor(screenY - imgHeight / zoomLevel
			+ unitTileHeight / zoomLevel);

		return{
			x: screenX,
			y: screenY,
			width: widthZoom,
			height: heightZoom
			}
	    }
}