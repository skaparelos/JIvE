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
		this._input_handler = new InputHandler(window, document.body)
		// setup an in-game menu 
		this.game_menu = new Game_Menu(this.screen)
		// scrolling speed: How fast is the map going to move using the arrows 
		this.speed = 15
		// The change in each axis to control map movement
		this.changeX = 0
		this.changeY = 0
		// checks whether a map change has happened since last draw 
		this.change = true
		// checks for a change in the menu (e.g. a click)
		this.game_menu_change = true

		this._last_mouse_click_event = null
		this._last_mouse_scroll_event = null
		this._last_zoom_level = this._input_handler.get_zoom_level()

  }

	start() {
		this.init_canvas(this.screen.get_width(), this.screen.get_height())
		// call draw() once to draw something
		this.draw()
		// draw map without an event trigger
		this.change = true
		// call the game loop function period times per second
		setInterval(this.game_loop.bind(this), this.screen.period)
	}

	init_canvas(width, height){
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


	clear() {
    	this.context.clearRect(0, 0, this.screen.get_width(), 
        	    this.screen.get_height() - this.game_menu.menu_height)
	}

	game_loop() {
		if (g_running) {
			/* update two times for each frame */
			this.update()
			this.update()
			this.draw()
		}
	}

	update() {
		let ih = this._input_handler
    	let keycode = ih.get_keycode()
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
			/* if ((this.changeX + dx)/this._last_zoom_level <
							this.map.max_changeX/this._last_zoom_level
					&& (this.changeX + dx)/this._last_zoom_level >
							-g_unit_tile_width/this._last_zoom_level) */
			this.changeX += dx

			/* if (((this.changeY + dy)/this._last_zoom_level <
					this.map.max_changeY/this._last_zoom_level -
						this.game_menu.menu_height/this._last_zoom_level)
					&& ((this.changeY + dy)/this._last_zoom_level >
						-this.map.max_changeY/this._last_zoom_level
						- this.game_menu.menu_height/this._last_zoom_level)) */
			this.changeY += dy

			// console.log("changeX= " + this.changeX);
			// console.log("changeY= " + this.changeY);

			// notify that there has been a change since the last draw
			this.change = true
		}

    	/* Handle screen resize */
		if (ih.get_screen_resized()) {
			this.screen.get_fullscreen()
			this.context = this.canvas.getContext('2d')
			ih.set_screen_resize_false()
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
			if (this.game_menu.clicked_menu(this._last_mouse_click_event)) {
				this.game_menu.handle_click(this._last_mouse_click_event) 
			} else { // make building
				var map_tiles = this.world_2_map_coords(this._last_mouse_click_event)
				if (map_tiles != -1) {
					this.map.build_building(map_tiles[0], map_tiles[1])
					this.change = true
				}
			}
		}

		/* Handle mouse scroll (tile selection) */
		if (ih.get_mouse_hover() != this._last_mouse_scroll_event) {
			this._last_mouse_scroll_event = ih.get_mouse_hover()
			var map_tiles = this.world_2_map_coords(this._last_mouse_scroll_event)
			if (map_tiles != -1) {
				this.map.update_selector(map_tiles[0], map_tiles[1])
				this.change = true
			}
		}
	}//end update


	draw() {
		if (this.change) {
      		// clear the screen
      		this.clear()

			/*
         	Check the 4 edges of the screen to see which tiles are there.
         	Then draw the tiles that can appear on the screen and nothing more

         	This is a big reduction:
         	in a 200x200 map we drop from 40.000 iterations to about 1000. 
			*/

			var start_i = 0
			var start_j = 0
			var end_i = this.map.height
			var end_j = this.map.width

			// res[0] -> tiley
			// res[1] -> tilex

			fake_event.clientX = 0
			fake_event.clientY = 0
			var res = this.world_2_map_coords(fake_event)
			if (res != -1) {
				start_j = res[1]
			}

			fake_event.clientX = this.screen.get_width()
			fake_event.clientY = 0
			res = this.world_2_map_coords(fake_event)
			if (res != -1) {
				start_i = res[0]
			}

			fake_event.clientX = 0
			fake_event.clientY = this.screen.get_height()
			res = this.world_2_map_coords(fake_event)
			if (res != -1) {
				end_i = (res[0] + 2 > this.map.height) ? this.map.height : res[0]+2
			}

			fake_event.clientX = this.screen.get_width()
			fake_event.clientY = this.screen.get_height()
			res = this.world_2_map_coords(fake_event)
			if (res != -1) {
				end_j = (res[1] + 1 > this.map.width) ? this.map.width : res[1] + 1
			}

			this.map.draw(this.context, this.changeX, this.changeY, 
							this._last_zoom_level, start_i, end_i, start_j, end_j)

			this.change = false
		}

		/* If there was a change in menu game (e.g. a click), redraw it */
    	if (this.game_menu_change) {
			this.game_menu.draw(this.context)
		} 

  }//end draw()


  /* Translates map coordinates to on screen coordinates
	 - Runs in O(1)
	 - Takes as input a click event
	 - Outputs the cell in the map that was clicked
  */
  world_2_map_coords(e) {
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
  }  //end world_2_map_coords

	set_mouse_click(e){
		this._mouse_click = e
	}

	set_mouse_hover(e){
		this._mouse_hover = e
	}

} // end of World class

