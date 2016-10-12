/**
 *  The selector is where the mouse points at at any given instance.
 *  i.e. which tile the user has selected
 */

class Selector{
	constructor(){
		this.tileX = 0
		this.tileY = 0
		//TODO change the images stuff
		this.img =  new cImage(-1, g_selector)
		this.imgNon = new cImage(-1, g_non_selector)
	}

	setSelector(tileY, tileX){
		this.tileX = tileX
		this.tileY = tileY
	}

	getSelector(){
		return {
			tileX: this.tileX,
			tileY: this.tileY
		}
	}
}


/**
 *  A map cell represents the contents of the level1 map
 *  The level0 map only consists of background tiles, that do not carry any
 *  extra information, however, level1 map cells carry a lot of information
 *  and this class is made to contain it. 
 */
class MapCell{
	constructor(type){
		/* TODO	do we need the id? */
		this.id = 0

		/*  (This helps path finding)
			Types:
			0 -> nothing is here
			1 -> non-walkable surface. i.e. either building or tree or etc..
			2 -> sprites */
		this.type = type

		/* This should hold the building instance or the sprite instance */
		this.entity = null
	}
}


class Map{
	constructor(){
		/* map_lvl0 holds only the background. Anything placed in this map
		shoud be walkable */
		this.map_lvl0 = []

		/* map_lvl1 holds all the non walkable stuff and the sprites */
		this.map_lvl1 = []

		/* width and height of both maps (in number of tiles) */
		this.width = 0, this.height = 0

		/* images needed for each map */
		//TODO need to remove the graphics from the data
		this.images_lvl0 = []

		/* the available buildings for the game and their images */
		this.buildings = g_buildings
		this.building_images = []

		this.load_map_from_file()
	} // end of constructor()


	/**
	 * Get the map levels
	 */
	getMaps(){
		return {
			mapLvl0: this.map_lvl0,
			mapLvl1: this.map_lvl1
		};
	}


	/**
	 * Get the width of the map in number of tiles
	 */
	getWidth(){
		return this.width
	}
	

	/**
	 * Get the height of the map in number of tiles
	 */
	getHeight(){
		return this.height
	}

	//TODO remove this
	getImgsLvl0(){
		return this.images_lvl0
	}
	

	/**
	 * The user selects a building type from the game_menu
	 * that is passed as a parameter, along with the position in the map.
	 */
	build_building(tiley, tilex, building_type) {
		// TODO get the building type, etc..

		// if there is no building there, then build
		if (this.map_lvl1[tiley][tilex].type == 0) {
			/*
			var building = new Building();
			building.set_image("house_blue.png");
			this.map_lvl1[tiley][tilex].type = 1;
			this.map_lvl1[tiley][tilex].entity = building;
			*/
		}
	} // end of ()


	/**
	 * Prints on console the two map levels in a way that can be used
	 * in "configure.js"
	 */
	export_map(){
	}


	/**
	 * loads a map based on what is found in the configure.js file
	 */
	load_map_from_file(){
		/* 1.0) Load map_lvl0 */
		this.map_lvl0 = g_level0_map
		this.height = this.map_lvl0.length
		this.width = this.map_lvl0[0].length
		console.log('map width = ' + this.width + ' height = ' + this.height)
		g_level0_map = []

		/* 1.1) load level 0 map images */
		var l = g_level0_images.length
		for (var i = 0; i < l; i++)
			this.images_lvl0.push(new cImage(g_level0_images[i][0],
				g_level0_images[i][1]))
		g_level0_images = []

		/* 2.0) Load map_lvl1 */
		for (var i = 0; i < this.height; i++) { // row
			this.map_lvl1[i] = []
			for (var j = 0; j < this.width; j++) { // column
				if (g_level1_map[i][j] == 0)
					this.map_lvl1[i][j] = new MapCell(0)
				else
					this.map_lvl1[i][j] = new MapCell(1)
			}
		}
		g_level1_map = []

		/* 3.0) load buildings and their images */
		this.buildings = g_buildings
		// load the images once and then use them for drawing.
		this.building_images = []
		for (var i = 0; i < this.buildings.length; i++)
			this.building_images.push(
				new cImage(-1, this.buildings[i].img_normal_path))
			g_buildings = []

		/* 4.0) set maximum scroll based on the map size */
		this.max_changeX = (this.width * (g_unit_tile_width / 2))
		this.max_changeY = (this.height * (g_unit_tile_height / 2)) / 2
	} // end of load_map_from_file()
}
