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
	"FPS" :  40,

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
const g_unit_tile_width = 128

/* UNIT TILE HEIGHT (smallest possible height) */
const g_unit_tile_height = 64


/***************************\
*           Images          *
\***************************/

/* Images must be in the IMAGES_DIR folder that you set in g_game_settings 
 * (see top of this documents */	


// load your images here (be it individual images or spritesheets)
const g_basic_images = {
	//"imageNickName1" : "imagePath1.png",
	//"imageNickName2" : "imagePath2.png"
}

// describe the position of each image within a spritesheet
const g_tileset1_frames = {
  	//"spriteName" : [x, y, width, height, anchorX, anchorY],
  	//e.g. "blue-house" : [10, 10, 128, 64, 0, 0],
}


/***************************\
*        Buildings          *
\***************************/

// load your buildings here
var g_buildings = [
	/*
	{ 'id': '0', 'width_tiles': '1', 'height_tiles': '1',
		'img_normal_path': 'house_blue.png', 'hp': '100' },

	{ 'id': '1', 'width_tiles': '1', 'height_tiles': '1',
		'img_normal_path': 'house_red.png', 'hp': '200' },

	{ 'id': '2', 'width_tiles': '1', 'height_tiles': '1',
		'img_normal_path': 'house_green.png', 'hp': '300' }
	*/
]


/***************************\
*         Maps              *
\***************************/

/**
 *  Load your own map:
 *  1) Create your map using Tiled and export it as map.csv
 *  2) run the following command in terminal:
 *       awk '{print "["$0"],"}' map.csv
 *  3) Copy Paste it here
 */

// load your map levels here
var g_level0_map = [
]

