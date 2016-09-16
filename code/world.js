
/* ------  World.js ------ */
/* This is the main entity. World contains everything.*/
var World = function(width, height){
	
	/* initialise the screen components */
	this.screen = new Screen(width, height);
	if(width == 0 && height == 0)
		this.screen.get_fullscreen();

	/* setup a new map */	
	this.map = new Map();
	this.map.load_map_from_file();

	/* scrolling speed: How fast is the map going to move using the arrows */
	this.speed = 20;

	/* The change in each axis */
	this.changeX = 0;
	this.changeY = 0;

	/* checks whether a change has happened since last draw */
	this.change = true;
	/* game state */
	this.running = true;

	//var g_UnitTileWidth ; 
	//var g_UnitTileHeight ;
};


World.prototype.start = function(){
	this.init_canvas(this.screen.get_width(), this.screen.get_height());
	// call the game loop function period times per second
	setInterval(this.game_loop.bind(this), this.screen.period);
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


World.prototype.clear = function () {
	/* Clears the screen */
	this.context.clearRect(0, 0, this.screen.width, this.screen.height);
};


World.prototype.game_loop = function () {
	if (this.running){
		this.update();	
		this.draw();
	}
};


World.prototype.update = function(){
	
    /* check if the user has pressed any map scrolling button */
    if (_keycode[0] == 1 || _keycode[1] == 1 || 
			_keycode[2] == 1 || _keycode[3] == 1) {

        var dx = 0,
            dy = 0;
        //up
        if (_keycode[0] == 1) dy = this.speed;
        //down
        if (_keycode[1] == 1) dy = -this.speed;
        //left
        if (_keycode[2] == 1) dx = this.speed;
        //right
        if (_keycode[3] == 1) dx = -this.speed;

        //update tiles the drawing position of each tile
        this.changeX += dx;
        this.changeY += dy;
   
		//notify that there has been a change since the last draw 
        this.change = true;
    }

	/* screen resize */
	if (_screen_resize){
		this.screen.get_fullscreen();
		this.context = this.canvas.getContext("2d");
		_screen_resize = false;
		this.change = true;
	}
};


World.prototype.draw = function(ctx){
	if(this.change){
		console.log("called");
		this.clear();
		this.map.draw(this.context, this.changeX, this.changeY);
		this.change = false;
	}
};


/* ------ Screen.js ------ */

var Screen = function(width, height){
	this.width = width;
	this.height = height;
	this.FPS = 50;
	this.period = 1000 / this.FPS; //in millisec
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


/* ------  Controller.js ------ */

var keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    P: 80,
    B: 66,
    ESC: 27,
    PLUS: 61,
    MINUS: 173
};


var _keycode = new Array(0, 0, 0, 0); //up, down, left, right

/* key is pressed */
window.addEventListener('keydown', function (e) {
    if (e.keyCode == keys.UP || e.keyCode == keys.W) _keycode[0] = 1;
    if (e.keyCode == keys.DOWN || e.keyCode == keys.S) _keycode[1] = 1;
    if (e.keyCode == keys.LEFT || e.keyCode == keys.A) _keycode[2] = 1;
    if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) _keycode[3] = 1;
    /*if (e.keyCode == keys.MINUS) { //zoom out
        if (g_zoomLevel < 4)
            Math.floor(g_zoomLevel++); 
        g_change=true;
    }
    if (e.keyCode == keys.PLUS) { //zoom in
        if(g_zoomLevel>1)
            Math.floor(g_zoomLevel--);
        g_change=true;
    }*/
    /*if (e.keyCode == keys.P && running==false){
        running=true;
        run();
    }*/
});


/* key no longer pressed */
window.addEventListener('keyup', function (e) {
    if (e.keyCode == keys.UP || e.keyCode == keys.W) _keycode[0] = 0;
    if (e.keyCode == keys.DOWN || e.keyCode == keys.S) _keycode[1] = 0;
    if (e.keyCode == keys.LEFT || e.keyCode == keys.A) _keycode[2] = 0;
    if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) _keycode[3] = 0;
});



/* right click */
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    //console.log("right click!");
    return false;
}, false);


/* mouse click */
window.addEventListener('mousedown', function (e) {
	switch (e.which) {
		case 1: //left click
       		//leftClick(e);
		break;
		case 2: /* middle mouse button */ break;
		case 3: /* right click has its own event listener */ break;
		/*default:   alert("You have a strange mouse!"); */
    }
});


window.addEventListener('mousemove', function (e) {
});


/* on window resize: */
var _screen_resize = false;
window.addEventListener("resize", function () {
	_screen_resize = true;
});
