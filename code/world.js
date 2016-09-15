
/* This is the main entity. World contains everything.*/
var World = function(width, height){
	
	/* initialise the screen components */
	this.screen = new Screen(width, height);
	if(width == 0 && height == 0)
		this.screen.get_fullscreen();
	
	this.map = new Map();
	this.map.load_map_from_file();

	//scrolling speed. i.e. How fast is the map going to move using the arrows
	this.speed = 15;

	this.changeX = 0;
	this.changeY = 0;

	this.change = true;
	this.running = true;

	//var g_UnitTileWidth ; 
	//var g_UnitTileHeight ;
};

World.prototype.start = function(){
	this.init_canvas(this.screen.get_width(), this.screen.get_height());
	//this.draw(this.context);
	//this.game_loop();
	setInterval(this.game_loop.bind(this), 50);
	/*setInterval( function() {
		this.game_loop();
	}, 50);
*/
};


World.prototype.init_canvas = function (width, height) {
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
};


World.prototype.update_canvas_size = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
	this.context = this.canvas.getContext("2d");
};


World.prototype.game_loop = function () {
	console.log("clear called");
	this.clear();
	this.draw();

};

World.prototype.clear = function () {
	this.context.clearRect(0, 0, this.screen.width, this.screen.height);
};


World.prototype.event_handler = function(){
	alert(1);
};


World.prototype.draw = function(ctx){
	this.map.draw(this.context);
};


/* Screen */
var Screen = function(width, height){
	this.width = width;
	this.height = height;
	this.FPS = 70;
	this.period = Math.floor(1000 / this.FPS) + 1; //in millisec
};


Screen.prototype.get_fullscreen = function(){
	//take client's screen size
   	this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
};


Screen.prototype.get_width = function(){
	return this.width;
};


Screen.prototype.get_height = function(){
	return this.height;
};
