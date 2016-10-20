// @global Game state
var g_running = true

class World extends EventEmitter {
	constructor (width, height){
		super()
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

		// checks whether a map change has happened since last draw so that a
		// redraw is needed 
		this._change = true

		this._previousLeftMouseClick = null
		this._previousMouseScroll = null

		// the user's set update function. this is a callback
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


	/**
	 *  updates the canvas size
	 */
	_updateCanvasSize(width, height) {
		this._canvas.width = width
		this._canvas.height = height
		this._context = this._canvas.getContext('2d')
	}


	/**
	 *  gets the new screen size and notifies the components in need
	 */
	_screenResize(){
		var size = this._screen.getFullScreen()
		this._updateCanvasSize(size.width, size.height)
		this._renderer.updateScreen(size.width, size.height)
		this._change = true
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
		let keyAction = ih.getKeyAction()

		// camera movement
		if (this._camera.move(keyAction) === true)
			this._change = true

		// Handle screen resize 
		if (ih.isScreenResized()) {
			this._screenResize()
		}

		// Handle keydown
		for (var key in keyAction){
			if (keyAction[key] === true){
				this.emit("keydown", {keyCode: key});
			}
		}
			
		// Handle left mouse click 
		if (ih.getLeftMouseClick() !== this._previousLeftMouseClick) {
			this._previousLeftMouseClick = ih.getLeftMouseClick()
			this.emit("leftmouseclick", this._previousLeftMouseClick)
		}

		// Handle mouse movement
		if (ih.getMouseHover() !== this._previousMouseScroll) {
			this._previousMouseScroll = ih.getMouseHover()
			this.emit("mousemove", this._previousMouseScroll)
		}

		// call user's update function everytime this update function is called
		if (this._userUpdateFunc !== null){
			if (this._userUpdateFunc() === true)
				this._change = true
		}

	}// end of update()


	/**
	 * Translates screen coordinates to on map coordinates
	 * Runs in O(1).
	 * 
	 * @param e A click event.
	 *
	 * Outputs the cell in the map that was clicked
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

		//return [tiley, tilex]
		return {
			tileY: tiley,
			tileX: tilex
		}

	}  //end screen2MapCoords



	/*** The following functions can be used by the user to develop his/her game: ***/
	
	/**
	 * Get the image manager to load the custom images
	 */
	getImageManager(){
		return this._imageManager
	}

	/**
	 *  Get the map to load each map layer
	 */
	getMap(){
		return this._map
	}


	/**
	 *  Get the selector to set where the mouse is pointing at in the map
	 */
	getSelector(){
		return this._selector
	}

	/**
	 *  set this to true whenever a change in the game needs to be reflected
	 *  in the screen by redrawing (e.g. if a movement takes place)
	 */
	setChange(change){
		this._change = change
	}


	setCameraZoomLevel(level){
		this._camera.setZoomLevel(zoomLevel)
		this._change = true
	}


	/**
	 *  set your update function
	 */
	setUserUpdateFunction(func){
		this._userUpdateFunc = func
	}

} // end of World class

