// @global Game state
var g_running = true;

class World extends EventEmitter {

	constructor(screenWidth, screenHeight){
		super();

		this._screen = new Screen(screenWidth, screenHeight);
		this._period = this._screen.getPeriod();
		this._map = new Map();
        this._selector = new Selector();
		this._inputHandler = new InputHandler();
		this._canvas = new Canvas(screenWidth, screenHeight);

		this._imageManager = new ImageManager();
		this._spriteSheet = new SpriteSheet(this._imageManager,
			this._canvas.getCtx());

		this._previousLeftMouseClick = null;
		this._previousMouseScroll = null;

		// the user's set update function. this is a callback set by the user
		this._userUpdateFunc = null;

		// used to control how often is requestAnimFrame called
		this._then = Date.now();

		// deltaTime can be used to make a game frame independent
		// keeps the time it took between the last two frame updates
		// measured in ms
		this._deltaTime = -1;

		// DEBUG
		if(g_DEBUG === true){
			this.__FPS = 0;
			this.__startTime = -1;
		}
		// END DEBUG

	}


	/**
	 *  Place here all the things that require the user to have entered
	 *  some input regarding the size of the maps etc..
	 */
	init(){
        this._canvas.init();

        var offsets = this._canvas.getCanvas();
        this._camera = new Camera(this._screen.getWidth(),
			this._screen.getHeight(), offsets.canvasOffsetTop,
			offsets.canvasOffsetLeft);

		this._renderer = new Renderer(this._canvas.getCtx(), this._camera,
			this._map, this._spriteSheet, this._selector);
	}


	start() {
		this.init();

		// DEBUG
		if (g_DEBUG === true){
			this.__startTime = Date.now();
		}
		// END DEBUG

		this._gameLoopReqAnim()
	}


	/**
	 *  gets the new screen size and notifies the components that need to be
	 *  notified for the screen resize
	 */
	_screenResize(){
		// TODO we need to get these correctly. The user might not use the whole screen as canvas
		var size = this._screen.getFullScreen();
		this._canvas.updateCanvasSize(size.width, size.height);
		this._camera.updateCameraSize(size.width, size.height);
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
		this._camera.move(keyAction, dt/10);

		// Handle screen resize 
		if (ih.isScreenResized()) {
			this._screenResize();
		}

		// Handle keydown
		for (var key in keyAction){
			if (keyAction[key] === true){
				this.emit("keydown", {keyCode: key})
			}
		}

		// Handle left mouse click
		var leftClick  = ih.getLeftMouseClick();
		var isLeftClicking = (leftClick !== this._previousLeftMouseClick);
		if (isLeftClicking) {
			this._previousLeftMouseClick = leftClick;
			this.emit("leftclick", leftClick);
		}

		// handle mouse hover and mouse dragging
		var mouseHover = ih.getMouseHover();
		var isHovering = (mouseHover !== this._previousMouseScroll);
		if (isHovering) {
			this._previousMouseScroll = mouseHover;
			this.emit("mousemove", mouseHover);

			// mouse drag
			if (ih.getLeftMouseDown())
				this.emit("leftdrag", mouseHover);
		}

		var isMouseWheelScrolled = ih.isMouseWheelScrolled();
		if (isMouseWheelScrolled !== false){
			var deltaY = isMouseWheelScrolled.deltaY;

			if (deltaY > 0 )
				this.emit("mousewheelforward", isMouseWheelScrolled);

			if (deltaY < 0)
				this.emit("mousewheelback", isMouseWheelScrolled);
		}

		// call user's update function everytime 
		// this update function is called
		if (this._userUpdateFunc !== null){
			this._userUpdateFunc(this._deltaTime);
		}

	}// end of update()


	/*** The following functions can be used by the user to develop his/her game: ***/

	/**
	 * Get the image manager to load the custom images
	 */
	getImageManager(){
		return this._imageManager;
	}

	
	getSpriteSheet(){
		return this._spriteSheet;
	}


	/**
	 *  Get the map to load each map layer
	 */
	getMap(){
		return this._map;
	}


	/**
	 *  Get the selector to set where the mouse is pointing at in the map
	 */
	getSelector(){
		return this._selector;
	}


	setCameraZoomLevel(level){
		this._camera.setZoomLevel(level);
	}


	/**
	 *  set the user's update function
	 */
	setUserUpdateFunction(func){
		if (typeof callback !== "function"){
			console.log("The callback must be a function");
			return;
		}

		this._userUpdateFunc = func;
	}

	
	getDeltaTime(){
		return this._deltaTime;
	}


	getScreen(){
		return this._screen;
	}


	getCamera(){
		return this._camera;
	}


	screen2MapCoords(e){
		return this._map.screen2MapCoords(e, this._camera);
	}

} // end of World class

