/**
 * cImage stands for custom Image
 */
class cImage {
	constructor(character, path){
		this._character = character
		this._loaded = false
		this._img = new Image()

		/* Once the image has been loaded set its width and height */
		var that = this
		this._img.onload = function () {
			that._width = this.width
			that._height = this.height
			that._loaded = true
		}

		this._img.src = 'imgs/' + path
	}


	/**
	 * draws the image on the screen
	 */
	draw(ctx, col, row, changeX, changeY, zoom_level, isEntity) {
		// make sure the image is loaded 
		if (this._loaded == false)
			return

		// Map to World coords conversion 
		var initX = (col - row) * g_unit_tile_width / 2
		var initY = (row + col) * g_unit_tile_height / 2
		var screenX = Math.floor(initX / zoom_level + changeX)
		var screenY = Math.floor(initY / zoom_level + changeY)

		// calculate the new tile width and height based on the zoom level
		var t_width_zoom = Math.floor(this._width / zoom_level)
		var t_height_zoom = Math.floor(this._height / zoom_level)

		// i.e. we are drawing the background
		if (isEntity === undefined) 
			ctx.drawImage(this._img, screenX, screenY, t_width_zoom, t_height_zoom)
		// i.e. we are drawing an entity (e.g. building)
		else if (isEntity == true) { 			
			ctx.drawImage(this._img,
				Math.round(screenX - this._width / (zoom_level * 2) +
					g_unit_tile_width / (zoom_level * 2)),
				Math.round(screenY - this._height / zoom_level +
					g_unit_tile_height / zoom_level),
				t_width_zoom, t_height_zoom)
		}
	}

	/**
	 * draw an image for the game menu.
	 */
	menu_draw(ctx, x, y){
		ctx.drawImage(this._img, Math.round(x), Math.round(y))
	}
}
