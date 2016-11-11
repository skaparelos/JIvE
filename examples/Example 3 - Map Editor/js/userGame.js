/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


var world;
var worldImageManager;
var worldSpriteSheetManager;
var worldSelector;
var worldMapLayer0;

// the name we gave to the html element to add the menu
const menuNameHTML = "hub"


/**
 * This is the main entry point
 */
function main() {

	var dim = calculateSideMenuDimensions()
	world = new World(dim.width, dim.height)
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();
	worldSelector = world.getSelector();

	// drag and drop is now disabled
	//enableDragging()

	initMenus()
	setupWorld()
}


function setupWorld(){

	// Load the map layers
	var layer0 = new MapLayer()
	layer0.load(g_level0_map, false)
	world.getMap().addLayer(layer0)

	// Load images to the world
	im = world.getImageManager()
	im.load(g_selector_images)

	// put the callback in the last one, otherwise it might not work
	im.load(g_basic_tilesets, function(){

		worldSpriteSheetManager.load("first_tileset", g_first_tileset_frames) 

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
		worldMapLayer0.setCell(tiles.tileY, tiles.tileX, selectorValue)		
	});

	world.on("leftclick", function(e){
		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
		//layer0.setCell(tiles.tileX, tiles.tileY, selectorValue)
		worldMapLayer0.setCell(tiles.tileY, tiles.tileX, selectorValue) 
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
			world.setCameraZoomLevel(2)
	});

	var wo = new WorldObject()
	var wo2 = new WorldObject()
	
	
}


var selectorValue = 0
function imageClicked(img){
	selectorValue = img.id
	var selectedImg = worldImageManager.get(img.id)
	worldSelector.setImg(selectedImg)
}

