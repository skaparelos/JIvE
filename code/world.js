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

		let zoomLevel = 2
		this.camera = new Camera(zoomLevel)

		//setup the input handler
		this._input_handler = new InputHandler(this.camera)

		// setup an in-game menu 
		//this.game_menu = new GameMenu(this.screen)

		// checks whether a map change has happened since last draw 
		this.change = true

		// checks for a change in the menu (e.g. a click)
		//this.game_menu_change = true

		this._last_mouse_click_event = null
		this._last_mouse_scroll_event = null

		this._initCanvas(this.screen.get_width(), this.screen.get_height())

		this.renderer = new Renderer(this, this.context, 
				this.map.getWidth(), this.map.getHeight(), 
				this.screen.get_width(), this.screen.get_height(),
				this.camera)

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
			this.update()
			if (this.change === true) {
				this.renderer.drawWholeScreen(this.camera.getChange(), 
					this.map.getMaps(), this.map.getImgsLvl0(), this.selector)
				this.change = false
			}
		}
	}


	update() {
		let ih = this._input_handler
    	let keycode = ih.getKeyCode()

		// camera movement
		if (this.camera.move(keycode) === true)
			this.change = true


    	/* Handle screen resize */
		if (ih.isScreenResized()) {
			this.screen.get_fullscreen()
			this.context = this.canvas.getContext('2d')
			ih.setScreenResize(false)
			this.change = true
		}


		let zoomLvl = ih.getZoomLevel() 
		if(this.camera.getZoomLevel() != zoomLvl){
			this.camera.setZoomLevel(zoomLvl)
			this.change = true
		}

		/* Handle left mouse click */
		if (ih.getMouseClick() != this._last_mouse_click_event) {
			this._last_mouse_click_event = ih.getMouseClick()
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
		if (ih.getMouseHover() != this._last_mouse_scroll_event) {
			this._last_mouse_scroll_event = ih.getMouseHover()
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

		var cameraChange = this.camera.getChange()
		var changeX = cameraChange.changeX
		var changeY = cameraChange.changeY

		var zoomLevel = this.camera.getZoomLevel()

		// adjustX=-40 has been set empirically to correct the tile choice
		var adjustX = -40 / zoomLevel

		var tilex = Math.floor(zoomLevel * (
				((e.clientX - changeX + adjustX) / g_unit_tile_width) +
				((e.clientY - changeY) / g_unit_tile_height)
				))

		var tiley = Math.floor(zoomLevel * (
				((e.clientY - changeY) / g_unit_tile_height) -
				((e.clientX - changeX + adjustX) / g_unit_tile_width)
				))

		if (tilex < 0 || tiley < 0 ||
			tilex >= this.map.width || tiley >= this.map.height)
			return -1

		if (tilex == undefined || tiley == undefined ||
			isNaN(tilex) || isNaN(tiley))
			return -1

		return [tiley, tilex]
		/*return {
			tiley: tiley,
			tilex: tilex
		};*/
	}  //end screen_2_map_coords


} // end of World class

