/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


/**
 * This is the main entry point
 */
function main() {

	// setup the in-game menu
	setUIMenu()

	// start the game
	initWorld()
}


/**
 * This is the function where the user specifies the updates that he wants to 
 * take place. This function is called every Screen.FPS times per second
 * (default set to 50).
 * 
 * This function should return true if a screen redraw needs to take place
 * false otherwise.
 *
 * Write all object updates in this functioun
 */
function _userUpdate(dt){
	return false
}


function onImagesLoaded(){
	//world.start()
	//console.log(im.get("2").width)
	//console.log(im.get("1").width)
}


function onUIClick(e){
	console.log("click ui")
	e.target.getAttribute('id')
}


function setUIMenu(){
	// var ui = document.getElementById('ui')
	// for UI you may use DOM listeners
	// ui.addEventListener('mouseup', this.onUIClick.bind(this), false);


	// don't show the map anymore
	document.getElementById('menu').style.display = "none";
	document.getElementById('ui').style.display = "block";

}


function initWorld() {

	// Initialise the world
	var world = new World(0, 0) // (0,0) means full screen

	// Set the userUpdate function 
	world.setUserUpdateFunction(_userUpdate)

	// Load the map layers
	var layer0 = new MapLayer()
	layer0.load(g_level0_map, false)
	world.getMap().addLayer(layer0)

	//TODO fix layer1
	//var layer1 = new MapLayer()
	//layer1.load(g_level1_map, true)
	//world.getMap().addLayer(layer1)

	// Load images to the world
	im = world.getImageManager()
	im.load(g_selector_images)
	//im.load(g_level0_images)
	//im.load(g_random_images)

	// put the callback in the last one, otherwise it might not work
	im.load(g_basic_tilesets, function(){

		// get spriteSheet
		var spriteSheet = world.getSpriteSheet()
		spriteSheet.load("first_tileset", g_first_tileset_frames) 

		// once images have been loaded, start the world
		// TODO do this using a counter or something to make sure all images 
		// have been loaded
		world.start()
	})
	
	// alternatively:
	// im.load(g_selector_images, onImagesLoaded)

	//var em = new EventEmitter()

	/*em.on("mousedown", function(e){
		console.log("fired!")
		console.log("e.x = " + e.x)
	})*/
	
	//var e = new Event('mousedown');
	//em.emit("mousedown", {x: 10, y: 20}) //, domEvent: e})

	//world.on("mouseclick", function (){
	//	console.log("clicked!!");
	//});

	//world.on("mousemove", this.onMouseMove.bind(this));
	
	world.on("mousemove", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		world.getSelector().setSelectorPos(tiles.tileY, tiles.tileX)
	});

	world.on("keydown", function(e){
		//console.log("pressed:"+ e.keyCode);
	});
	
	//world.on("zoomchange", 
	//don't include it by default in the world.js file

	// Start the world
	//world.start()
}


function onMouseMove(e){
	var tiles = world.screen2MapCoords(e)
	world.getSelector().setSelectorPos(tiles.tileY, tiles.tileX)	
}


