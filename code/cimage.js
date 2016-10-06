/**
 * cImage stands for custom Image
 */
var cImage = function (character, path) {
  this.character = character
  this.loaded = false
  this.img = new Image()

	/* Once the image has been loaded set its width and height */
  var that = this
  this.img.onload = function () {
    that.width_ = this.width
    that.height_ = this.height
    that.loaded = true
  }

  this.img.src = 'imgs/' + path
}

_cImage = cImage.prototype

_cImage.draw = function (ctx, col, row, changeX, changeY, zoom_level, isEntity) {
	/* make sure the image is loaded */
  if (this.loaded == false)
    return

	/* Map to World coords conversion */
  var initX = (col - row) * g_unit_tile_width / 2
  var initY = (row + col) * g_unit_tile_height / 2
  var screenX = Math.floor(initX / zoom_level + changeX)
  var screenY = Math.floor(initY / zoom_level + changeY)

	// calculate the new tile width and height based on the zoom level
  var t_width_zoom = Math.floor(this.width_ / zoom_level)
  var t_height_zoom = Math.floor(this.height_ / zoom_level)

  if (isEntity === undefined) // i.e. we are drawing the background
    ctx.drawImage(this.img, screenX, screenY, t_width_zoom, t_height_zoom)
  else if (isEntity == true) { // i.e. we are drawing an entity (e.g. building)
    ctx.drawImage(this.img,
			Math.round(screenX - this.width_ / (zoom_level * 2) +
				g_unit_tile_width / (zoom_level * 2)),
			Math.round(screenY - this.height_ / zoom_level +
				g_unit_tile_height / zoom_level),
			t_width_zoom, t_height_zoom)
  }
}

_cImage.menu_draw = function (ctx, x, y) {
  ctx.drawImage(this.img, Math.round(x), Math.round(y))
}

