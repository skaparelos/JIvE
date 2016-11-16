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
var worldMap;
var mapDims = 50


var layerCtr = 0;
var selectedLayer = 0


// the name we gave to the html element to add the menu
const menuNameHTML = "hub"


/**
 * This is the main entry point
 */
function main() {

	// drag and drop is now disabled (if on comments)
	//enableDragging()

	//initMenus()
	setupWorld(mapDims)
}


function setupWorld(mapDim){

	// remove canvas if already exists (in case of map dimension resize)
	var body = document.getElementsByTagName("BODY")[0];
	var canvas = document.getElementById("myCanvas")
	if (canvas)
		body.removeChild(canvas)

	// also remove the images that have been loaded
	var flexitem1 = document.getElementById("flexitem1")
	while (flexitem1.hasChildNodes()) {
    	flexitem1.removeChild(flexitem1.lastChild);
	}

	var dim = calculateSideMenuDimensions()
	world = new World(dim.width, dim.height)
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();
	worldSelector = world.getSelector();

	//TODO check for error
	mapDim = parseInt(mapDim)

	worldMap = world.getMap()

	// TODO fix this
	// do not remove this from here in the map editor
	var wo = new WorldObject(0)
	
	// Load the map layers
	var layer0 = new MapLayer()
	
	// code to make map editor work:
	layer0.createEmptyLayer(mapDim, mapDim)
	worldMap.addLayer(layer0)

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
	
		// once images have been loaded, start the world
		world.start()
	})
	
	world.on("mousemove", function(e){
		if (e.clientY > world.getScreen().getHeight())
			return;

		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;

		worldSelector.setPos(tiles.tileY, tiles.tileX)
	});

	world.on("leftdrag", function(e){
		if (e.clientY > world.getScreen().getHeight())
			return;

		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;
	
		// TODO take the MapCell type from the worldObject and let the user define whether something is walkable via the map editor
		if (selectorValue != -1)
			worldMap.getLayer(selectedLayer).setCell(tiles.tileY, tiles.tileX, MapCell.TYPES.WALKABLE_NON_EMPTY, worldObjects[selectorValue - 1].getID()) 	
	});

	world.on("leftclick", function(e){
		if (e.clientY > world.getScreen().getHeight())
			return;

		var tiles = world.screen2MapCoords(e)
		if (tiles === -1) return;

		if (selectorValue != -1)
			worldMap.getLayer(selectedLayer).setCell(tiles.tileY, tiles.tileX,  MapCell.TYPES.WALKABLE_NON_EMPTY, worldObjects[selectorValue - 1].getID()) 
	});


	var camera = world.getCamera()
	world.on("mousewheelforward", function(e){
		if (e.clientY > world.getScreen().getHeight())
			return;
		camera.increaseZoomLevel()	
	});

	world.on("mousewheelback", function(e){
		if (e.clientY > world.getScreen().getHeight())
			return;
		camera.decreaseZoomLevel()	
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



function downloadMap(){
	var jsonified = WorldObject.exportJSON()
	jsonified += world.getMap().exportJSON()

	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonified);
	var dlAnchorElem = document.getElementById('exportLink');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", "mapLevel.js");
	//dlAnchorElem.click();
}


function changeSelectedLayer(that){
	selectedLayer = parseInt(that.value)
	console.log("Selected layer= " + selectedLayer)
}


function addLayer(){

	// HTML stuff
	layerCtr += 1	
	var layerForm = document.getElementById('layers');
	var radioBtnHtml = '<input type="radio" name="layer" onclick="changeSelectedLayer(this)" value="' + layerCtr + '"> Layer ' + layerCtr + '<br>';
	layerForm.innerHTML += radioBtnHtml;

	// JIvE stuff
	var layer = new MapLayer()
	layer.createEmptyLayer(mapDims, mapDims, MapCell.TYPES.EMPTY)
	worldMap.addLayer(layer)
}




