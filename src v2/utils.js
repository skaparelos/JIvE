class Utils{

	static xhrGet(URI, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", URI, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status == "200") {
				callback(xhr);
			}
		}
		xhr.send();
	}


	/**
	 * Translates screen coordinates to map coordinates
	 * Runs in O(1).
	 *
	 * @param e A click event.
	 *
	 * Outputs the cell in the map that was clicked
	*/
	static screen2MapCoords(e, camera, mapWidth, mapHeight) {

		/*  Solve the drawing functions for tileX, tileY
			These are the 2 drawing equations:
			screenX = (tileX - tileY) * unittileWidth / zoomLevel / 2 + camX;
			screenY = (tileY + tileX) * unittileHeight / zoomLevel / 2 + camY;
		*/

		var cam = camera.getCamera();
		var camX = cam.x;
		var camY = cam.y;
		var zoomLevel = cam.zoomLevel;

		var clientX = e.clientX - cam.canvasOffsetLeft;
		var clientY = e.clientY - cam.canvasOffsetTop;

		// adjustX=-40 has been set empirically to correct the tile choice
		var adjustX = -40 / zoomLevel;

		var tilex = Math.floor(zoomLevel * (
				((clientX - camX + adjustX) / g_unit_tile_width) +
				((clientY - camY) / g_unit_tile_height)
				));

		var tiley = Math.floor(zoomLevel * (
				((clientY - camY) / g_unit_tile_height) -
				((clientX - camX + adjustX) / g_unit_tile_width)
				));

		if (tilex < 0 || tiley < 0 ||
			tilex >= mapWidth || tiley >= mapHeight)
			return -1;

		if (tilex == undefined || tiley == undefined ||
				isNaN(tilex) || isNaN(tiley))
			return -1;

		return {
			tileY: tiley,
			tileX: tilex
		}
	}



	/**
	* Calculates the drawing coordinates of an image given the tile position
	* (i.e. row, col), the image width & height, as well as the camera position
	* and the zoom level.
	*
	* Gets as input cartesian coordinates along with some extra input and
	* calculates the isometric coordinates on screen to draw.
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
	*/
	static map2ScreenCoords(row, col, imgWidth, imgHeight, camX, camY, zoomLevel, unitTileWidth, unitTileHeight){

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