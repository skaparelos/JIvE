var Map_cell = function () {
	this.id = 0;
	this.type = 0;
	//var non_walkable
	//var sprite
};


var Map = function() {
	/* map_lvl0 holds only the background. Anything in this map is walkable */
	var map_lvl0 = [];
	/* map_lvl1 holds all the non walkable stuff and the sprites */
	var map_lvl1 = [];
	var width = 0, height = 0;	
};


Map.prototype.draw = function(){
	alert(2);
};


Map.prototype.load_map_from_file = function(){

};
