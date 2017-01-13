/**
 * This file is to be manipulated by those who develop using JIvE
 * to contain the game and the menu logic
 */
var world;
var worldImageManager;
var worldSpriteSheetManager;
var worldSelector;
var worldMap;

// counts the number of layers the user has created
var layerCtr = 0;

// points to the selected layer
var selectedLayer = 0;

// holds the nickname of the basic object currently chose
// -1 means no object is chosen
var selectedBasicObjectID = -1;

// the name we gave to the html element to add the menu
const menuNameHTML = "hub";


/**
 * This is the main entry point
 */
function main() {
	deletePrevious();
    var mapDim = parseInt(document.getElementById("mapdim").value);
	setupWorld(mapDim)
}


/**
 * Deletes the previously used canvas and the images uploaded by the user
 */
function deletePrevious(){
    // remove canvas if already exists (in case the user created
    // a new map with different dimensions)
    var body = document.getElementsByTagName("BODY")[0];
    var canvas = document.getElementById("myCanvas");
    if (canvas)
        body.removeChild(canvas);

    // in the same case, also remove the images that have been loaded
    var flexitem1 = document.getElementById("flexitem1");
    var loadedImgs = document.getElementsByClassName("floatedImg");
    for (var i in loadedImgs.length){
        flexitem1.removeChild(loadedImgs[i]);
    }
}

function setupWorld(mapDim){

	// create the world
	var dim = calculateSideMenuDimensions();
	world = new World(dim.width, dim.height);
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();
	worldSelector = world.getSelector();
	worldMap = world.getMap();

	// TODO fix this
	// do not remove this from here in the map editor
	// this is done to initialise a world object with id = 0,
	// which is the white-black tile used to draw the editor
	new BasicObject("black-white-tile"); // white-black
	//var sel = new BasicObject(1); // the selector
	
	// Load the map layers
	var layer0 = new MapLayer();
	
	// code to make map editor work:
	layer0.createEmptyLayer(mapDim, mapDim);
	worldMap.addLayer(layer0);

	// code to test loading
	//world.getMap().load()

	// Load images to the world
	im = world.getImageManager();

	//TODO put the selector in a tileset. Sometimes is called last and as
	// a result the callback is undefined. and thus, the map doesn't appear on screen
	//TODO change this in configure.js and include it in the tileset.
	im.load(g_selector_images);

	// put the callback function in the last image load, otherwise it
	// might not work correctly.
	im.load(g_basic_tilesets, function(){

		worldSpriteSheetManager.load("first_tileset", g_first_tileset_frames);
		//worldSpriteSheetManager.load("second_tileset", g_second_tileset_frames);

		worldSelector = world.getSelector();
		var selectorImg = worldImageManager.get("selector");
		worldSelector.setImg(selectorImg);
	
		// once images have been loaded, start the world
		world.start();
        addListeners();

    });
}


function addListeners(){


	//	world.on("draw", function(e){
	//	});

	//world.on("cameramove")

    // TODO make this work
    //world.on("keydown=", function(e){
    //	console.log("it works!!")
    //});

	/*world.on("keydown", function(e){
	 if (e.keyCode == Utils.key("="))
	 world.setCameraZoomLevel(1);

	 if (e.keyCode == Utils.key("-"))
	 world.setCameraZoomLevel(3);
	 });*/

    world.on("mousemove", function(e){
        if (e.clientY > world.getScreen().getHeight())
            return;

        var tiles = world.screen2MapCoords(e);
        if (tiles === -1) {
            worldSelector.setPos(-1, -1);
        	return;
        }

        worldSelector.setPos(tiles.tileY, tiles.tileX)
    });

    world.on("leftdrag", function(e){
        if (e.clientY > world.getScreen().getHeight())
            return;

        var tiles = world.screen2MapCoords(e);
        if (tiles === -1) {
            worldSelector.setPos(-1, -1);
            return;
        }
        // TODO take the MapCell type from the worldObject and let the user
		// define whether something is walkable via the map editor
        if (selectedBasicObjectID != -1)
            worldMap.getLayer(selectedLayer).setCell(tiles.tileY, tiles.tileX,
                MapCell.TYPES.WALKABLE_NON_EMPTY,
                BasicObject.worldObjects[selectedBasicObjectID].getNickName());
    });

    world.on("leftclick", function(e){
        if (e.clientY > world.getScreen().getHeight())
            return;

        var tiles = world.screen2MapCoords(e);
        if (tiles === -1) return;

        if (selectedBasicObjectID != -1)
            worldMap.getLayer(selectedLayer).setCell(tiles.tileY, tiles.tileX,
                MapCell.TYPES.WALKABLE_NON_EMPTY,
                BasicObject.worldObjects[selectedBasicObjectID].getNickName());
    });

    var camera = world.getCamera();
    world.on("mousewheelforward", function(e){
        if (e.clientY > world.getScreen().getHeight())
            return;
        camera.increaseZoomLevel();
    });

    world.on("mousewheelback", function(e){
        if (e.clientY > world.getScreen().getHeight())
            return;
        camera.decreaseZoomLevel();
    });
}

/**
 *	When the "walkable" propety of a world Object changes,
 *  this function sets the right value for the world object.
 */
function setWalkable(checked){
	if (selectedBasicObjectID != -1)
        BasicObject.worldObjects[selectedBasicObjectID].setWalkable(checked)
}


/**
 * called when the user clicks an image that he has loaded.
 * This function is called whenever a <img> element is clicked. the onclick
 * function is set to call this function passing (this) as a parameter.
 * @param img - the image clicked
 */
function imageClicked(img){
	selectedBasicObjectID = img.id;
	console.log("IMG ID = " + img.id)
	var selectedImg = worldImageManager.get("selector"); // img.id
	worldSelector.setImg(selectedImg);
	updateObjectProperties(selectedBasicObjectID)
}


/**
 *	TODO this should be useful only in case of image loading, to show the correct value
 */
function updateObjectProperties(worldObjectID){
	var walkableCheckBox = document.getElementById("bo_walkable");
	walkableCheckBox.checked = BasicObject.worldObjects[worldObjectID].getWalkable()
}


/**
 * Exports and downloads the map file to the user.
 */
function downloadMap(){
	var jsonified = BasicObject.exportJSON();
	jsonified += world.getMap().exportJSON();

	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonified);
	var dlAnchorElem = document.getElementById('exportLink');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", "mapLevel.js");
}


/**
 *  called when the user chooses a different layer to draw on
 */
function changeSelectedLayer(that){
	selectedLayer = parseInt(that.value);
}


/**
 * Adds a new layer in the map.
 */
function addLayer(){

	// HTML stuff
	layerCtr += 1;
	var layerForm = document.getElementById('layers');
	var radioBtnHtml = '<input type="radio" name="layer" onclick="changeSelectedLayer(this)" value="' + layerCtr + '"> L' + layerCtr; 
	layerForm.innerHTML += radioBtnHtml;

	// JIvE stuff
	var layer = new MapLayer();
    var mapDim = parseInt(document.getElementById("mapdim").value);
	layer.createEmptyLayer(mapDim, mapDim, MapCell.TYPES.EMPTY);
	worldMap.addLayer(layer)
}


/**
 * Used to load an image using the 'browse' button.
 *
 * function taken from:
 * https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
 *
 */
function previewFiles(that) {

	var files = that.files;

	function readAndPreview(file) {

		// Make sure `file.name` matches our extensions criteria
		if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
			var reader = new FileReader();

			reader.addEventListener("load", function () {

				// use JIvE to load images so it is easy to draw them on the map
				var imgPath = this.result;

				//remove the filename extension
				var fileName = file.name.replace(/\.[^/.]+$/, "");
				worldImageManager.load2MapEditor(fileName, imgPath, imageLoaded);

			}, false);
			reader.readAsDataURL(file);
		}
	}

	if (files) {
		[].forEach.call(files, readAndPreview);
	}
}


/**
 * Callback function that is called once an image uploaded by the user has been
 * loaded. It makes the uploaded image availabe to the user in the menu at the
 * bottom
 *
 * @param img -
 * @param id -
 * @param fileName -
 */
function imageLoaded(img, id, fileName) {

	if (fileName === undefined || fileName == "") {
        fileName = id;
        console.log("An image is saved using its id.");
    }

    // load it to the spriteSheet
    var tempFrames = {};
    tempFrames[fileName] = [0, 0, img.width, img.height, 0, 0];
    worldSpriteSheetManager.load(fileName, tempFrames);

    // create a new basic object with the file name as identifier
    new BasicObject(fileName);

    // show the loaded image to the user by injecting it in the HTML code.
    var panel = document.getElementById("flexitem1");
    if (panel.innerHTML.includes("your images"))
        panel.innerHTML = "<input id='" + fileName + "' class='floatedImg' " +
            "type='image' onclick='imageClicked(this)' src='" + img.src + "'/>";
    else {
    	// += instead of =
        panel.innerHTML += "<input id='" + fileName + "' class='floatedImg' " +
			"type='image' onclick='imageClicked(this)' src='" + img.src + "'/>";
    }
}


/**
 * Calculates the size of the menu and the map editor.
 * @returns {{width: number, height: number}}
 */
function calculateSideMenuDimensions(){
	
	// set the size of the menu on the side
	var menuSpace = 400;
	var screenWidth = document.body.clientWidth;
	var screenHeight = document.body.clientHeight;

	// locate the position of the menu
	var hub = document.getElementById(menuNameHTML);
	hub.style.left = 0 + "px";
	hub.style.width = 100 + "%";
	hub.style.height = 250 + "px";
	hub.style.bottom = 0 + "px";

	return {
		width: screenWidth ,//- menuSpace - 2,
		height: screenHeight - 250 - 2
	}
}

