// @global Game state
var g_running = true

class World extends EventEmitter {

	constructor(screenWidth, screenHeight){
		super()

		this._screen = new Screen(screenWidth, screenHeight)
		this._period = this._screen.getPeriod()

		this._map = new Map()
		this._camera = new Camera()
		this._inputHandler = new InputHandler()

		// canvas stuff
		this._canvas = null
		this._context = null
		this._initCanvas()

		this._imageManager = new ImageManager()
		this._selector = new Selector()
		this._spriteSheet = new SpriteSheet(this._imageManager, this._context)

		this._previousLeftMouseClick = null
		this._previousMouseScroll = null

		// the user's set update function. this is a callback
		this._userUpdateFunc = null

		// used to control how often is requestAnimFrame called
		this._then = Date.now()

		// deltaTime can be used to make a game frame independent
		// keeps the time it took between the last two frame updates
		// measured in ms
		this._deltaTime = -1

		// DEBUG
		if(g_DEBUG === true){
			this.__FPS = 0
			this.__startTime = -1;
		}
		// END DEBUG

	}


	/**
	 *  Place here all the things that require the user to have entered
	 *  some input regarding the size of the maps etc..
	 */
	init(){

		document.body.insertBefore(this._canvas, document.body.childNodes[0])

		this._map.init()

		this._renderer = new Renderer(this, this._context, 
			this._screen.getWidth(), this._screen.getHeight(),
			this._camera, this._imageManager, this._map, this._selector,
			this._spriteSheet)
	}


	start() {
		this.init()

		// DEBUG
		if (g_DEBUG === true){
			this.__startTime = Date.now();
		}
		// END DEBUG

		this._gameLoopReqAnim()
	}


	_initCanvas(){
		this._canvas = document.createElement('canvas')
		this._canvas.setAttribute("id", "myCanvas")
		this._canvas.className = "myCanvas" // this is to be able to change its position
		this._canvas.width = this._screen.getWidth()
		this._canvas.height = this._screen.getHeight()
		this._context = this._canvas.getContext('2d')
		//document.body.insertBefore(this._canvas, document.body.childNodes[0])
 	}


	/**
	 * Sets the position of the canvas
	 * to be 
	 */
	setCanvasPos(x, y, width, height){
		if (x !== undefined)
			this._canvas.style.left = x + "px"

		if (y !== undefined)
			this._canvas.style.top = y + "px"

		if (width !== undefined)
			this._canvas.width = width

		if (height !== undefined)
			this._canvas.height = height

		//TODO inform the viewport for rendering
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

		// TODO we need to get these correctly. The user might not use the 
		// whole screen as canvas
		var size = this._screen.getFullScreen()
		this._updateCanvasSize(size.width, size.height)
		this._renderer.updateScreen(size.width, size.height)
	}


	/* Using requestAnimationFrame */
	_gameLoopReqAnim(){
		if (g_running === false)
			return;

		// reqAnimFrame is capped to 60FPS. In order to control FPS, we call
		// the drawing function every _period (see the if below)
    	requestAnimationFrame(this._gameLoopReqAnim.bind(this)) 

		var now = Date.now()
		this._deltaTime = now - this._then

		if (this._deltaTime >= this._period) {
			this._update(this._deltaTime)
			this._renderer.drawWholeScreen()
        	this._then = now - (this._deltaTime % this._period)	

			// DEBUG
			if (g_DEBUG === true){
				this.__FPS += 1
				var elapsed = Date.now() - this.__startTime

				if (elapsed >= 1000){
					console.log("FPS: " + this.__FPS)
					this.__FPS = 0 
					this.__startTime = Date.now()
				}
			}
			// END DEBUG
		} 
	}


	_update(dt) {
		let ih = this._inputHandler
		let keyAction = ih.getKeyAction()

		// TODO maybe this needs a beter explanation
		// elapsed/10 so that if FPS = 60 and elapsed = 16.6ms
		// then this will be called 60 times per second and 
		// over one second we will have 1.66 * 60 = 100
		// then 100*scrollingSpeed will give us the desired number
		// of pixels to scroll per minute
		// 
		// The end result is that if we change FPS the scrolling speed
		// remains the same, while if we don't include this, then the 
		// scrolling speed is frame dependent

		// camera movement
		this._camera.move(keyAction, dt/10)

		// Handle screen resize 
		if (ih.isScreenResized()) {
			this._screenResize()
		}

		// Handle keydown
		for (var key in keyAction){
			if (keyAction[key] === true){
				this.emit("keydown", {keyCode: key})
			}
		}

		// Handle left mouse click
		var leftClick  = ih.getLeftMouseClick()
		var isClicking = (leftClick !== this._previousLeftMouseClick)
		if (isClicking) {
			this._previousLeftMouseClick = leftClick
			this.emit("leftclick", leftClick)
		}

		// handle mouse hover and mouse dragging
		var mouseHover = ih.getMouseHover()
		var isHovering = (mouseHover !== this._previousMouseScroll)
		if (isHovering) {
			this._previousMouseScroll = mouseHover
			this.emit("mousemove", mouseHover)

			// mouse drag
			if (ih.getLeftMouseDown())
				this.emit("leftdrag", mouseHover)
		}

		var isMouseWheelScrolled = ih.isMouseWheelScrolled()
		if (isMouseWheelScrolled !== false){
			var deltaY = isMouseWheelScrolled.deltaY

			if (deltaY > 0 )
				this.emit("mousewheelforward", isMouseWheelScrolled)

			if (deltaY < 0)
				this.emit("mousewheelback", isMouseWheelScrolled)
		}

		// call user's update function everytime 
		// this update function is called
		if (this._userUpdateFunc !== null){
			this._userUpdateFunc(this._deltaTime)
		}

	}// end of update()



	/*** The following functions can be used by the user to develop his/her game: ***/
	
	/**
	 * Get the image manager to load the custom images
	 */
	getImageManager(){
		return this._imageManager
	}

	
	getSpriteSheet(){
		return this._spriteSheet
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


	setCameraZoomLevel(level){
		this._camera.setZoomLevel(level)
	}


	/**
	 *  set the user's update function
	 */
	setUserUpdateFunction(func){
		if (typeof callback !== "function"){
			console.log("The callback must be a function")
			return;
		}

		this._userUpdateFunc = func
	}

	
	getDeltaTime(){
		return this._deltaTime
	}


	screen2MapCoords(e){
		return this._map.screen2MapCoords(e, this._camera)
	}

} // end of World class

