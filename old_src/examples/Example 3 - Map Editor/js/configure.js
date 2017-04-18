/**
 *
 *  configure.js
 *
 *  This file is used to configure the game, the map and the images
 *
 *  Make sure you read this. You might miss important information
 *
 */

/***************************\
*     Game Settings         *
\***************************/

const g_game_settings = {

	// Set to true for debugging information
	// if you are not sure about this, set it to false
	"DEBUG" : false,
	
	// max 60, min 30 (>60 does not have an effect, and <30 is not playable)
	// this might be discrete, it depends on the browser
	// actual values might be 30 or 60, anything in between is just an average
	// of 30 and 60. e.g. 45 might be half 30fps, half 60fps
	// better set this to 60 and make it work. (this is your best option)
	"FPS" :  60,

	// the directory where we should look for images
	"IMAGES_DIR" : "imgs/"
}
const g_DEBUG = g_game_settings["DEBUG"]


/***************************\
*          Buttons          *
\***************************/

// Camera Settings
const g_camera_settings = {

	"scrollingSpeed" : 15,

	"initialZoomLevel" : 2,

	"allowChangeInZoomLevel" : true,

	// which keys to use for which movement
	// you may add or delete keys 
	"UP" : [
		Utils.keyboardKeys.UP, // the up arrow
		Utils.keyboardKeys.W   // w
	],
	"DOWN" : [
		Utils.keyboardKeys.DOWN, // the down arrow
		Utils.keyboardKeys.S     // s
	],
	"LEFT" : [
		Utils.keyboardKeys.LEFT, // the left arrow
		Utils.keyboardKeys.A     // a
	],
	"RIGHT" : [
		Utils.keyboardKeys.RIGHT, // the right arrow
		Utils.keyboardKeys.D      // d
	]
}


/***************************\
*          Tiles            *
\***************************/

/* UNIT TILE WIDTH (smallest possible width) */
var g_unit_tile_width = 128;

/* UNIT TILE HEIGHT (smallest possible height) */
var g_unit_tile_height = 64;


/***************************\
*           Images          *
\***************************/

/* Images must be in the IMAGES_DIR folder that you set in g_game_settings 
 * (see top of this document)
 *
 * set the locations of the various frames within the tileset
 * [x, y, width, height, anchorX, anchorY] (anchorX, anchorY are used for animation)
 * */

const g_black_white_tile = "black-white-tile";

const g_first_tileset_frames = {
    "selector" : [0, 0, 128, 64, 0, 0],
    "black-white-tile" : [128, 0, 128, 64, 0, 0]
};

const g_coins_frames = {
	"grey-coin-1" : [0,   0, 77, 80, 0, 0],
	"grey-coin-2" : [107, 0, 77, 80, 0, 0],
	"grey-coin-3" : [214, 0, 77, 80, 0, 0],
	"grey-coin-4" : [321, 0, 77, 80, 0, 0],
	"grey-coin-5" : [428, 0, 77, 80, 0, 0]
};

const g_images = {
	"map-tileset" :  ["editor_tileset.png", g_first_tileset_frames],
	"grey-coins"  :  ["coins.png", g_coins_frames],
	"dirt-tile"   :  ["dirt.png"]
};


