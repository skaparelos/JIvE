/* game state */
var g_running = true

var fake_event = {
  clientX: -1,
  clientY: -1
}

class World {
	constructor (width, height){
		// initialise the screen components
		this.screen = new Screen(width, height)

		// setup a new map 
		this.map = new Map()

		//setup the input handler
		this._input_handler = new InputHandler(window, document.body, ui)

		// setup an in-game menu 
		//this.game_menu = new GameMenu(this.screen)

		// scrolling speed: How fast is the map going to move using the arrows 
		this.speed = 15

		// The change in each axis to control map movement
		this.changeX = 0
		this.changeY = 0

		// checks whether a map change has happened since last draw 
		this.change = true

		// checks for a change in the menu (e.g. a click)
		//this.game_menu_change = true

		this._last_mouse_click_event = null
		this._last_mouse_scroll_event = null
		this._last_zoom_level = this._input_handler.get_zoom_level()

		this._initCanvas(this.screen.get_width(), this.screen.get_height())

		this.renderer = new Renderer(this, this.context, 
				this.map.getWidth(), this.map.getHeight(), 
				this.screen.get_width(), this.screen.get_height(), 
				this._last_zoom_level)

		this.selector = new Selector()

	}


	start() {
		// draw map without an event trigger
		this.change = true
		// call the game loop function period times per second
		setInterval(this.game_loop.bind(this), this.screen.period)
	}


	_initCanvas(width, height){
		this.canvas = document.createElement('canvas')
		this.canvas.width = width
		this.canvas.height = height
		this.context = this.canvas.getContext('2d')
		document.body.insertBefore(this.canvas, document.body.childNodes[0])
 	}


	update_canvas_size(width, height) {
		this.canvas.width = width
		this.canvas.height = height
		this.context = this.canvas.getContext('2d')
	}


	game_loop() {
		if (g_running) {
			/* update two times for each frame */
			this.update()
			this.update()
			if (this.change) {
				this.renderer.drawWholeScreen(this.changeX, this.changeY, 
					this.map.getMaps(), this.map.getImgsLvl0(), this.selector)
				this.change = false
			}
		}
	}


	update() {
		let ih = this._input_handler
    	let keycode = ih.getKeyCode()
		let keys = {
			UP : 0,
			DOWN: 1,
			LEFT: 2,
			RIGHT: 3
		}


    	/* Handle map scrolling */
    	if (keycode[keys.UP] == 1 || keycode[keys.DOWN] == 1 ||
            	keycode[keys.LEFT] == 1 || keycode[keys.RIGHT] == 1) {
     
			var dx = 0
			var dy = 0
			  
			if (keycode[keys.UP] == 1) dy = this.speed
			if (keycode[keys.DOWN] == 1) dy = -this.speed
			if (keycode[keys.LEFT] == 1) dx = this.speed
			if (keycode[keys.RIGHT] == 1) dx = -this.speed

			// update tiles the drawing position of each tile
			this.changeX += dx
			this.changeY += dy

			// notify that there has been a change since the last draw
			this.change = true
		}


    	/* Handle screen resize */
		if (ih.isScreenResized()) {
			this.screen.get_fullscreen()
			this.context = this.canvas.getContext('2d')
			ih.setScreenResize(false)
			this.change = true
		}


		/* Handle zoom level */
		if (this._last_zoom_level != keycode[4]) {
			this._last_zoom_level = keycode[4]
			this.change = true
		}


		/* Handle left mouse click */
		if (ih.get_mouse_click() != this._last_mouse_click_event) {
			this._last_mouse_click_event = ih.get_mouse_click()
			// check if the click was in the map or in the game menu
			//if (this.game_menu.clicked_menu(this._last_mouse_click_event)) {
			//	this.game_menu.handle_click(this._last_mouse_click_event) 
			//} else { // make building
			var map_tiles = this.screen_2_map_coords(this._last_mouse_click_event)
			if (map_tiles != -1) {
				this.map.build_building(map_tiles[0], map_tiles[1])
				this.change = true
			}
		}

		/* Handle mouse scroll (tile selection) */
		if (ih.get_mouse_hover() != this._last_mouse_scroll_event) {
			this._last_mouse_scroll_event = ih.get_mouse_hover()
			var map_tiles = this.screen_2_map_coords(this._last_mouse_scroll_event)
			if (map_tiles != -1) {
				this.selector.setSelector(map_tiles[0], map_tiles[1])
				this.change = true
			}
		}
	}//end update


	/* Translates screen coordinates to on map coordinates
	 - Runs in O(1)
	 - Takes as input a click event
	 - Outputs the cell in the map that was clicked
	*/
	screen_2_map_coords(e) {
		/*  Solve the drawing functions for tileX, tileY
			These are the 2 drawing functions:
			screenX = (tileX - tileY) * unittileWidth / 2 + changeX;
			screenY = (tileY + tileX) * unittileHeight / 2 + changeY;
		*/

		if (this.map.map_lvl0[0][0] == undefined)
			// || this.map.length != this.map.height)
			return -1

		// adjustX=-40 has been set empirically to correct the tile choice
		var adjustX = -40 / this._last_zoom_level

		var tilex = Math.floor(this._last_zoom_level * (
				((e.clientX - this.changeX + adjustX) / g_unit_tile_width) +
				((e.clientY - this.changeY) / g_unit_tile_height)
				))

		var tiley = Math.floor(this._last_zoom_level * (
				((e.clientY - this.changeY) / g_unit_tile_height) -
				((e.clientX - this.changeX + adjustX) / g_unit_tile_width)
				))

		if (tilex < 0 || tiley < 0 ||
			tilex >= this.map.width || tiley >= this.map.height)
			return -1

		if (tilex == undefined || tiley == undefined ||
			isNaN(tilex) || isNaN(tiley))
			return -1

		return [tiley, tilex]
		// TODO maybe return object:
		// it is easier to handle
		//	{ "tiley":tiley,
		//	  "tilex":tilex
		//	}
	}  //end screen_2_map_coords


} // end of World class

