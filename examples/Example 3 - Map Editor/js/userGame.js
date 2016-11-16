/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


var world;
var worldImageManager;
var worldSpriteSheetManager;
var worldSelector;
var worldMapLayer0;
var worldObjects = [];

// the name we gave to the html element to add the menu
const menuNameHTML = "hub"


/**
 * This is the main entry point
 */
function main() {

	mapDimInput = 50

	// drag and drop is now disabled (if on comments)
	//enableDragging()

	//initMenus()
	setupWorld(mapDimInput)
}


function setupWorld(mapDim){

	// remove canvas if already exists (in case of map dimension resize)
	var body = document.getElementsByTagName("BODY")[0];
	var canvas = document.getElementById("myCanvas")
	if (canvas)
		body.removeChild(canvas)

	var dim = calculateSideMenuDimensions()
	world = new World(dim.width, dim.height)
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();
	worldSelector = world.getSelector();

	//TODO check for error
	mapDim = parseInt(mapDim)

	// TODO fix this
	// do not remove this from here in the map editor
	var wo = new WorldObject(0)

	// Load the map layers
	var layer0 = new MapLayer()

	// code to make map editor work:
	layer0.createEmptyLayer(mapDim, mapDim)
	world.getMap().addLayer(layer0)

	// code to test loading
	//world.getMap().load()

	// Load images to the world
	im = world.getImageManager()
	im.load(g_selector_images)


	// put the callback in the last one, otherwise it might not work
	im.load(g_basic_tilesets, function(){

		worldSpriteSheetManager.load("first_tileset", g_first_tileset_frames) 
		worldSpriteSheetManager.load("second_tileset", g_second_tileset_frames)

		worldSelector = world.getSelector()
		var selectorImg = worldImageManager.get("selector")
		worldSelector.setImg(selectorImg)

		worldMapLayer0 = world.getMap().getLayer(0)
	
		// once images have been loaded, start the world
		world.start()
	})
	
	world.on("mousemove", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		worldSelector.setPos(tiles.tileY, tiles.tileX)
	});

	world.on("leftdrag", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		if (selectorValue != -1)
			worldMapLayer0.setCell(tiles.tileY, tiles.tileX, 1, worldObjects[selectorValue - 1].getID()) 	
	});

	world.on("leftclick", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		//layer0.setCell(tiles.tileX, tiles.tileY, selectorValue)
		if (selectorValue != -1)
			worldMapLayer0.setCell(tiles.tileY, tiles.tileX, 1, worldObjects[selectorValue - 1].getID()) 
		// TODO the problem is that the renderer tries to load the picture from the spritesheet. HOWEVER, these pictures are only loaded into the imageManager
	});

	// TODO make this work
	//world.on("keydown=", function(e){
	//	console.log("it works!!")
	//});

	world.on("keydown", function(e){
		if (e.keyCode == Utils.key("="))
			world.setCameraZoomLevel(1)

		if (e.keyCode == Utils.key("-"))
			world.setCameraZoomLevel(3)
	});

}


var selectorValue = -1
function imageClicked(img){
	selectorValue = img.id
	var selectedImg = worldImageManager.get(img.id)
	worldSelector.setImg(selectedImg)
}

