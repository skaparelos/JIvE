
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
	this.speed = 15;
	/* starting zoom level. Also change at the bottom */
	this.zoom_level = 2;
	this.mouse_click_event = null;
	this.mouse_scroll_event = null;	

	/* The change in each axis to control map movement */
	this.changeX = 0;
	this.changeY = 0;

	/* checks whether a change has happened since last draw */
	this.change = true;
	/* game state */
	this.running = true;
};


World.prototype.start = function(){
	this.init_canvas(this.screen.get_width(), this.screen.get_height());
	//call draw() once to draw something
	this.draw(); 
	// draw map without an event trigger.
	this.change = true;
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
		/* update two times for each frame */
		this.update();
		this.update();	
		this.draw();
	}
};


World.prototype.update = function(){
	
    /* Handle map scrolling */
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

	/* Handle screen resize */
	if (_screen_resize){
		this.screen.get_fullscreen();
		this.context = this.canvas.getContext("2d");
		_screen_resize = false;
		this.change = true;
	}

	/* Handle zoom level */
	if (this.zoom_level != _keycode[4]){
		this.zoom_level = _keycode[4];
		this.change = true;
	}

	/* Handle left mouse click */
	if (this.mouse_click_event != _mouse_click_event){
		this.mouse_click_event = _mouse_click_event;
		var map_tiles = this.world_2_map_coords(_mouse_click_event);
		//console.log("Tiles = " + map_tiles);
	}

	/* Handle mouse scroll (tile selection) */
	if (this.mouse_scroll_event != _mouse_scroll_event){
		this.mouse_scroll_event = _mouse_scroll_event;
		var map_tiles = this.world_2_map_coords(_mouse_scroll_event);
		if (map_tiles != -1){
			this.map.update_selector(map_tiles[0], map_tiles[1]);
			this.change = true;
		}
	}
};


World.prototype.draw = function(){
	if(this.change){
		// clear the screen
		this.clear();

 		/* 
			Check the 4 edges of the screen to see which tiles are there.
			Then draw the tiles that can appear on the screen and nothing more
            
			This is a big reduction: 
			in a 200x200 map we drop from 40.000 iterations to about 1000.
        */
        
        var start_i = 0,
            start_j = 0,
            end_i = this.map.height,
            end_j = this.map.width;

        fake_event.clientX = 0;
        fake_event.clientY = 0;
        var res = this.world_2_map_coords(fake_event);
        if (res != -1) {
            start_j = res.tileX;
        }

        fake_event.clientX = this.screen.width;
        fake_event.clientY = 0;
        res = this.world_2_map_coords(fake_event);
        if (res != -1) {
            start_i = res.tileY;
        }

        fake_event.clientX = 0;
        fake_event.clientY = this.screen.height;
        res = this.world_2_map_coords(fake_event);
        if (res != -1) {
            end_i = (res.tileY + 2 > this.map.height) ? this.map.height : res.tileY + 2;
        }

        fake_event.clientX = this.screen.width;
        fake_event.clientY = this.screen.height;
        res = this.world_2_map_coords(fake_event);
        if (res != -1) {
            end_j = (res.tileX + 1 > this.map.width) ? this.map.width : res.tileX + 1;
        }

		this.map.draw(this.context, this.changeX, 
						this.changeY, this.zoom_level, start_i, end_i,
						start_j, end_j);	

		this.change = false;
	}
};


/* Translates map coordinates to on screen coordinates 
	- Runs in O(1)
	- Takes as input a click event
	- Outputs the cell in the map that was clicked
*/
World.prototype.world_2_map_coords = function (e) {

    /*  Solve the drawing functions for tileX, tileY
        These are the 2 drawing functions:
        screenX = (tileX - tileY) * unittileWidth / 2 + changeX;
        screenY = (tileY + tileX) * unittileHeight / 2 + changeY;  
	*/
   
	if(this.map.map_lvl0[0][0] == undefined) 
			//|| this.map.length != this.map.height)
		return -1;

	//adjustX=-40 has been set empirically to correct the tile choice	
	var adjustX = -40/this.zoom_level;
	
	var tilex = Math.floor(this.zoom_level * ( 
				((e.clientX - this.changeX + adjustX)/g_unit_tile_width) + 
				((e.clientY - this.changeY)/g_unit_tile_height)
				));

	var tiley = Math.floor(this.zoom_level * (
				((e.clientY - this.changeY)/g_unit_tile_height) - 
				((e.clientX - this.changeX + adjustX)/g_unit_tile_width)
				));

	if (tilex < 0 || tiley < 0 || 
			tilex >= this.map.width || tiley >= this.map.height)
		return -1;

	if (tilex == undefined || tiley == undefined || 
			isNaN(tilex) || isNaN(tiley))
		return -1;

    return [tiley, tilex]
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
    PLUS_firefox: 61, // firefox has different codes
    MINUS_firefox: 173, 
    PLUS: 187,
    MINUS: 189 
};


var _keycode = new Array(0, 0, 0, 0, 2); //up, down, left, right, zoom_level

/* key is pressed */
window.addEventListener('keydown', function (e) {

	/* Map scrolling */
    if (e.keyCode == keys.UP || e.keyCode == keys.W) _keycode[0] = 1;
    if (e.keyCode == keys.DOWN || e.keyCode == keys.S) _keycode[1] = 1;
    if (e.keyCode == keys.LEFT || e.keyCode == keys.A) _keycode[2] = 1;
    if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) _keycode[3] = 1;

	/* zoom level */
    if (e.keyCode == keys.MINUS || e.keyCode == keys.MINUS_firefox ) { //zoom out
        if (_keycode[4] < 4)
            _keycode[4]++; 
    }
    if (e.keyCode == keys.PLUS || e.keyCode == keys.PLUS_firefox) { //zoom in
        if(_keycode[4] > 1)
            _keycode[4]--;
    }

	/* Game pause */
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
var _mouse_click_event;
window.addEventListener('mousedown', function (e) {
	switch (e.which) {
		case 1: //left click
			_mouse_click_event = e;
		break;
		case 2: /* middle mouse button */ break;
		case 3: /* right click has its own event listener (see above) */ break;
		/*default:   alert("You have a strange mouse!"); */
    }
});


var _mouse_scroll_event;
window.addEventListener('mousemove', function (e) {
	_mouse_scroll_event = e;
});


/* on window resize: */
var _screen_resize = false;
window.addEventListener("resize", function () {
	_screen_resize = true;
});


var fake_event = {
    clientX: -1,
    clientY: -1
};
