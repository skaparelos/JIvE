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
 * (see top of this documents */	


const g_selector_images = {
	"selector" : "non_selector.png"
};


const g_basic_tilesets = {
	"first_tileset" :  "selector.png",
	"second_tileset" : "tileset.png",
};

const g_first_tileset_frames = {
	"0" : [0, 0, 128, 64, 0, 0]
};


const g_second_tileset_frames = {
	"5" : [0, 0, 128, 110, 0, 0],
	"4" : [128, 0, 128, 110, 0, 0],
	"3" : [256, 0, 128, 110, 0, 0],
	"2" : [0, 110, 128, 64, 0, 0],
	"1" : [128, 110, 128, 64, 0, 0]	
};
