var World = function(width, height){
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
	myGameArea.start(this.screen.width, this.screen.height);
	this.draw();
};


World.prototype.event_handler = function(){
	alert(1);
};

World.prototype.draw = function(){
	this.map.draw();
};

var myGameArea = {
    canvas: document.createElement("canvas"),
    ctx: this.context,
    start: function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    update_canvas_size: function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    },
    clear: function (width, height) {
        this.context.clearRect(0, 0, width, height);
    }
};
