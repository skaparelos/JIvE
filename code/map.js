var Map_Cell = function (type) {
	/* TODO	do we need the id?*/
	this.id = 0;

	/*  (This helps path finding)
		Types:	
		0 -> nothing is here
		1 -> non-walkable surface. i.e. either building or tree or etc..
		2 -> sprites */
	this.type = type;
	
	/* This should hold the building instance or the sprite instance */	 
	this.entity = null;
};


var Map = function() {

	/* map_lvl0 holds only the background. Anything placed this map 
	shoud be walkable */
	this.map_lvl0 = [];

	/* map_lvl1 holds all the non walkable stuff and the sprites */
	this.map_lvl1 = [];

	/* width and height of both maps */
	this.width = 0, this.height = 0;

	/* images needed for each map */
	this.images_lvl0 = [];
	this.images_lvl1 = [];

	/* set these to 0 initially */
	this.selector_tilex = 0;
	this.selector_tiley = 0;
};


Map.prototype.draw = function(ctx, changeX, changeY, zoom_level, 
			start_i, end_i, start_j, end_j){
	
	/* draw level 0 */
	for (var i = start_i; i < end_i; i++){ //row
		for (var j = start_j; j < end_j; j++) { //column
			var val = this.map_lvl0[i][j];
			this.images_lvl0[val-1].draw(ctx, j, i, changeX, changeY, zoom_level);
            }
	}
	
	/* draw level 1 */
	for (var i = start_i; i < end_i; i++){ //row
		for (var j = start_j; j < end_j; j++) { //column
			if(this.map_lvl1[i][j].entity != null)
				this.map_lvl1[i][j].entity.image.draw(ctx, j, i, changeX, changeY, zoom_level);
            }
	}

	/* draw selector */
	if(this.map_lvl1[this.selector_tiley][this.selector_tilex].type == 0)
		this.selector.draw(ctx,	this.selector_tilex, this.selector_tiley, 
			changeX, changeY, zoom_level);
	else
		this.non_selector.draw(ctx,	this.selector_tilex, this.selector_tiley, 
			changeX, changeY, zoom_level);
};


Map.prototype.update_selector = function (tiley, tilex){
	/* update the tile selector */
	this.selector_tiley = tiley;
	this.selector_tilex = tilex;
};


Map.prototype.build_building = function (tiley, tilex){
	//TODO get the building type, etc..
	
	var building = new Building();
	building.set_image("house.png");
	this.map_lvl1[tiley][tilex].type = 1;
	this.map_lvl1[tiley][tilex].entity = building;
};


Map.prototype.load_map_from_file = function(){

	/* 1.0) Load map_lvl0 */
	this.map_lvl0 = g_level0_map;
	this.height = this.map_lvl0.length;
	this.width  = this.map_lvl0[0].length;
	console.log("map width = " + this.width + " height = " + this.height);
	g_level0_map = [];

	/* 1.1) load level 0 map images */	
    var l = g_level0_images.length;
    for(var i=0; i<l; i++)
		this.images_lvl0.push(new cImage(g_level0_images[i][0], 
			g_level0_images[i][1]));
	g_level0_images = [];

	/* 2.0) Load map_lvl1 */
	for (var i = 0; i < this.height; i++){ //row
		this.map_lvl1[i] = [];
		for (var j = 0; j < this.width; j++) { //column
			if(g_level1_map[i][j] == 0)
				this.map_lvl1[i][j] = new Map_Cell(0);
			else
				this.map_lvl1[i][j] = new Map_Cell(1);
		}
	}
	g_level1_map = [];

	/* 3.0) load the image of the selector */
	this.selector = new cImage(-1, g_selector);
	this.non_selector = new cImage(-1, g_non_selector);

	/* 4.0) set maximum scroll based on the map size */
	this.max_changeX = (this.width * (g_unit_tile_width /2));
	this.max_changeY = (this.height * (g_unit_tile_height/2))/2;
};


var Building = function(){
	this.width = 1;
	this.height = 1;

	/* toDraw variable checks whether that cell contains something that must
		be drawn. e.g. if we have a house 2x2 cells, we only want to draw it
		once and not 4 times. 
		 ___ ___
		|org|   |
		 --- ---
		|   |   |
         --- ---
		we only want to draw the house at origin (org), not 4 times.
	 */
	this.toDraw = true;
	this.image = null;
};

Building.prototype.set_image = function (image_path){
	this.image = new cImage(-1, image_path);
};

