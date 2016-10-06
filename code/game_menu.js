/* ------ menu.js ------- */
/* This is the in-game menu */

var Game_Menu = function (screen) {
  this.menu_width = screen.width
  this.menu_height = 150
  this.menu_start_height = screen.height - this.menu_height
	// array with the options
  this.options = []

	// add some options
  this.add_option(0, 0, '#ffffff')
  this.add_option(0, 55)
  this.add_option(55, 0, '#F49AC2')
  this.add_option(55, 55)
  this.add_option(110, 0)
  this.add_option(165, 0)

  this.options[1].set_image('icon.jpg')
}

_Game_Menu = Game_Menu.prototype

_Game_Menu.add_option = function (x, y, colour) {
  if (colour === undefined) {
    colour = '#779ECB'
  }
	// create a new option
  var option = new Menu_Option(x + 2, this.menu_start_height + 2 + y,
			 50, 50, colour)
	// add the option in the menu
  this.options.push(option)
}

/**
 * Draws the game menu and its options
 * @param ctx, the context
 */
_Game_Menu.draw = function (ctx) {
	// clear the current game menu
  this.clear(ctx)

	// draw the options
  len = this.options.length
  for (var i = 0; i < len; i++)
    this.options[i].draw(ctx)
}

/**
 * Clears the game menu
 * @param ctx, the context
 */
_Game_Menu.clear = function (ctx) {
	// Menu background colour
  ctx.fillStyle = '#283f33'
  ctx.fillRect(0, this.menu_start_height, this.menu_width, this.menu_height)
}

/**
 * Determines whether a mouse click event was in the game menu or not
 * @param e, the mouse click event
 */
_Game_Menu.clicked_menu = function (e) {
  if (e.clientY > this.menu_start_height)
    return true
  else
		return false
}

/**
 * Handles a left click on the game menu
 *  @param e, the mouse click event
 */
_Game_Menu.handle_click = function (e) {
	// TODO
	// must detect which button is it
}

/**
 * A menu option represents an option in the game menu.
 * e.g. a house menu option would require a click in order to build a house
 * @param x, the x coordinate in the game menu
 * @param y, the y coordinate in the game menu
 * @param width, the width of the menu option
 * @param height, the height of the menu option
 * @param colour, the colour the menu option will have
 */
var Menu_Option = function (x, y, width, height, colour) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.colour = colour
}

/**
 * Add an image to the menu option.
 * @param image_path, the path to the image to add
 */
Menu_Option.prototype.set_image = function (image_path) {
  this.image = new cImage(0, image_path)
}

/**
 * Draw each menu option in the game menu
 * @param ctx, the context
 */
Menu_Option.prototype.draw = function (ctx) {
  if (this.image === undefined) {
    ctx.fillStyle = this.colour
    ctx.fillRect(this.x, this.y, this.width, this.height)
  } else {
    this.image.menu_draw(ctx, this.x, this.y)
  }
}

