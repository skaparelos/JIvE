// Game state
var g_running = true

class World {
	constructor (width, height){
		this._screen = new Screen(width, height)
		this._map = new Map()
		this._camera = new Camera(g_init_zoom_level)
		this._inputHandler = new InputHandler(this._camera)

		// canvas stuff
		this._canvas = null
		this._context = null
		this._initCanvas()

		this._imageManager = new ImageManager()
		this._selector = new Selector()

		// setup an in-game menu 
		//TODO create this in game menu class and put
		// event listeners for the menu (we should have this separate than the
		// input handler. Input handler handles the basic stuff
		// perhaps I need to add update() methods to several classes
		//this.game_menu = new GameMenu(this._screen)

		// checks whether a map change has happened since last draw 
		this._change = true

		// checks for a change in the menu (e.g. a click)
		//this.game_menu_change = true

		this._last_mouse_click_event = null
		this._last_mouse_scroll_event = null

		this._userUpdateFunc = null

	}


	/**
	 *  Place here all the things that require the user to have entered
	 *  some input regarding the size of the maps etc..
	 */
	init(){
		this._renderer = new Renderer(this, this._context, 
			this._screen.getWidth(), this._screen.getHeight(),
			this._camera, this._imageManager, this._map, this._selector)
	}


	start() {
		this.init()
		// draw map without an event trigger
		this._change = true
		// call the game loop function period times per second
		setInterval(this._gameLoop.bind(this), this._screen.getPeriod())
	}


	_initCanvas(){
		this._canvas = document.createElement('canvas')
		this._canvas.width = this._screen.getWidth()
		this._canvas.height = this._screen.getHeight()
		this._context = this._canvas.getContext('2d')
		document.body.insertBefore(this._canvas, document.body.childNodes[0])
 	}


	//TODO check if this function is ever used
	_updateCanvasSize(width, height) {
		this._canvas.width = width
		this._canvas.height = height
		this._context = this._canvas.getContext('2d')
	}


	_gameLoop() {
		if (g_running === false)
			return;

		this._update()
		if (this._change === true) {
			this._renderer.drawWholeScreen()
			this._change = false
		}
	}


	_update() {
		let ih = this._inputHandler
    	let keycode = ih.getKeyCode()

		// camera movement
		if (this._camera.move(keycode) === true)
			this._change = true


    	// Handle screen resize 
		if (ih.isScreenResized()) {
			this._screen.getFullScreen()
			this._context = this._canvas.getContext('2d')
			ih.setScreenResize(false)
			this._change = true
		}


		let zoomLevel = ih.getZoomLevel() 
		if(this._camera.getZoomLevel() !== zoomLevel){
			this._camera.setZoomLevel(zoomLevel)
			this._change = true
		}

		// Handle left mouse click 
		if (ih.getMouseClick() !== this._last_mouse_click_event) {
			this._last_mouse_click_event = ih.getMouseClick()
			// check if the click was in the map or in the game menu
			//if (this.game_menu.clicked_menu(this._last_mouse_click_event)) {
			//	this.game_menu.handle_click(this._last_mouse_click_event) 
			//} else { // make building
			var map_tiles = this.screen2MapCoords(this._last_mouse_click_event)
			if (map_tiles != -1) {
				//TODO register a left click function by the user
				//this._map.build_building(map_tiles[0], map_tiles[1])
				this._change = true
			}
		}

		// Handle mouse scroll (tile selection)
		if (ih.getMouseHover() !== this._last_mouse_scroll_event) {
			this._last_mouse_scroll_event = ih.getMouseHover()
			var map_tiles = this.screen2MapCoords(this._last_mouse_scroll_event)
			if (map_tiles != -1) {
				this._selector.setSelector(map_tiles[0], map_tiles[1])
				this._change = true
			}
		}

		if (this._userUpdateFunc !== null){
			this._userUpdateFunc()
		}

	}//end of update()


	/* Translates screen coordinates to on map coordinates
	 - Runs in O(1)
	 - Takes as input a click event
	 - Outputs the cell in the map that was clicked
	*/
	screen2MapCoords(e) {
		/*  Solve the drawing functions for tileX, tileY
			These are the 2 drawing functions:
			screenX = (tileX - tileY) * unittileWidth / 2 + changeX;
			screenY = (tileY + tileX) * unittileHeight / 2 + changeY;
		*/

		var mapWidth = this._map.getWidth()
		var mapHeight = this._map.getHeight()

		var cameraChange = this._camera.getChange()
		var changeX = cameraChange.changeX
		var changeY = cameraChange.changeY

		var zoomLevel = this._camera.getZoomLevel()

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
			tilex >= mapWidth || tiley >= mapHeight)
			return -1

		if (tilex == undefined || tiley == undefined ||
				isNaN(tilex) || isNaN(tiley))
			return -1

		return [tiley, tilex]
		/*return {
			tiley: tiley,
			tilex: tilex
		};*/

	}  //end screen2MapCoords

	
	getImageManager(){
		return this._imageManager
	}


	getCamera(){
		return this._camera
	}


	getMap(){
		return this._map
	}


	getSelector(){
		return this._selector
	}


	setChange(change){
		this._change = change
	}


	getChange(){
		return this._change
	}
	
	getCanvas(){
		return this._canvas
	}

	
	getContext(){
		return this._context
	}
	
	
	getScreen(){
		return this._screen
	}


	setUserUpdateFunction(func){
		this._userUpdateFunc = func
	}

} // end of World class

