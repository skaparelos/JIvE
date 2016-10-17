/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


/**
 * This is the main entry point
 */
function main() {

	// don't show the map anymore
	document.getElementById('map').style.display = 'none';
	document.getElementById('menu').style.display = "none";
	document.getElementById('ui').style.display = "block";

	// start the game	
	initWorld()
};


/**
 * This is the function where the user specifies the updates that he wants to 
 * take place. This function is called every Screen.FPS times per second
 * (default set to 50).
 * 
 * Write all object updates in this function
 */
function _userUpdate(){
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

	//var layer1 = new MapLayer()
	//layer1.load(g_level1_map)
	//world.getMap().addLayer(layer1)

	// Load images to the world
	var im = world.getImageManager()
	im.load(g_level0_images)
	im.load(g_selector_images)
	
	// Start the world
	world.start()
}


var town = null;
function chooseMap(){

	document.getElementById('map').style.display = 'block';
	document.getElementById('placeholder').style.display = 'block';

	AmCharts.makeChart("map",{
	"type": "map",
	"pathToImages": "http://www.amcharts.com/lib/3/images/",
	"addClassNames": true,
	"fontSize": 15,
	"color": "#FFFFFF",
	"projection": "mercator",
	"backgroundAlpha": 1,
	"backgroundColor": "rgba(80,80,80,1)",
	"dataProvider": {
		"map": "greeceLow",
		"getAreasFromMap": true,
		"images": [
			{
				"top": 40,
				"left": 60,
				"width": 80,
				"height": 40,
				"pixelMapperLogo": true,
				"imageURL": "http://pixelmap.amcharts.com/static/img/logo.svg",
				"url": "http://www.amcharts.com"
			}
		]
	},
	"balloon": {
		"horizontalPadding": 15,
		"borderAlpha": 0,
		"borderThickness": 1,
		"verticalPadding": 15
	},
	"areasSettings": {
		"color": "rgba(129,129,129,1)",
		"outlineColor": "rgba(80,80,80,1)",
		"rollOverOutlineColor": "rgba(80,80,80,1)",
		"rollOverBrightness": 20,
		"selectedBrightness": 20,
		"selectable": true,
		"unlistedAreasAlpha": 0,
		"unlistedAreasOutlineAlpha": 0
	},
	//"smallMap": {},

	// Listeners
	"listeners": [{
	"event": "clickMapObject",
	"method": function(event) {
		document.getElementById("placeholder").innerHTML =  event.mapObject.title;
		town = event.mapObject.title;
		main();
	}
	}],
	"imagesSettings": {
		"alpha": 1,
		"color": "rgba(129,129,129,1)",
		"outlineAlpha": 0,
		"rollOverOutlineAlpha": 0,
		"outlineColor": "rgba(80,80,80,1)",
		"rollOverBrightness": 20,
		"selectedBrightness": 20,
		"selectable": true
	},
	"linesSettings": {
		"color": "rgba(129,129,129,1)",
		"selectable": true,
		"rollOverBrightness": 20,
		"selectedBrightness": 20
	},
	"zoomControl": {
		"zoomControlEnabled": true,
		"homeButtonEnabled": false,
		"panControlEnabled": false,
		"right": 38,
		"bottom": 30,
		"minZoomLevel": 1,
		"gridHeight": 100,
		"gridAlpha": 0.1,
		"gridBackgroundAlpha": 0,
		"gridColor": "#FFFFFF",
		"draggerAlpha": 1,
		"buttonCornerRadius": 2
	}
	});
}

