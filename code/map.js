var Map_cell = function (type) {
	/*
		
	*/
	this.id = 0;

	/*
		// this helps path finding 
		Types:	
		0 -> nothing is here
		1 -> non-walkable surface. i.e. either building or tree or etc..
		2 -> sprites
	*/
	this.type = type;
	
	/* This should hold the building instance or the sprite instance */	 
	this.entity = 0;
};


var Map = function() {
	/* map_lvl0 holds only the background. Anything in this map is walkable */
	this.map_lvl0 = [];
	/* map_lvl1 holds all the non walkable stuff and the sprites */
	this.map_lvl1 = [];
	this.width = 0, this.height = 0;
	this.images_lvl0 = [];
	this.images_lvl1 = [];
};


Map.prototype.draw = function(ctx, changeX, changeY, zoom_level){
	
	/* draw level 0 */
	for (var i = 0; i < this.height; i++){ //row
		for (var j = 0; j < this.width; j++) { //column
			var val = this.map_lvl0[i][j];
			this.images_lvl0[val-1].draw(ctx, j, i, changeX, changeY, zoom_level);
            }
	}
	
	/* draw level 1 */
	//TODO

	/* draw selector */
	this.selector.draw(ctx,	this.selector_tilex, this.selector_tiley, 
		changeX, changeY, zoom_level);
	
};


Map.prototype.update_selector = function (tiley, tilex){
	this.selector_tiley = tiley;
	this.selector_tilex = tilex;
};


Map.prototype.load_map_from_file = function(){
	/* Load map_lvl0 first */
	this.map_lvl0 = g_level0_map;
	this.height = this.map_lvl0.length;
	this.width  = this.map_lvl0[0].length;
	console.log("map width = " + this.width + " height = " + this.height);
	g_level0_map = [];

	/* load level 0 map images */	
    var l = g_level0_images.length;
    for(var i=0; i<l; i++)
		this.images_lvl0.push(new cImage(g_level0_images[i][0], 
			g_level0_images[i][1]));
	g_level0_images = [];

	/* load the image of the selector */
	this.selector = new cImage(-1, g_selector);
};
