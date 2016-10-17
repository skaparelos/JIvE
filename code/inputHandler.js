/**
 * The input handler class deals with input handling (what a surprise!)
 * here we attach event listeners and define the functions that should occur
 * when an event is triggered .
 * 
 * - It is connected with world.js in a 'polling' fashion everytime the 
 * update() function in the world.js is called, it asks to get the latest
 * updates. This should be 50 times a second. 
 * The alternative is to implement this in an 'interrupt' manner, i.e. every
 * time an event occurs, notify the world, however the mouse_hover event might
 * cause some problems as it might get called extremely often resulting to 
 * an overhead
 *
 * - We only need one instance of this class.
 */
class InputHandler{
	constructor(camera){
		// the three things we will add event listeners on:
		this._ui = document.getElementById('ui')
		this._docBody = document.body
		this._window = window

		this._camera = camera

		// up, down, left, right 
		this._keycode = [0, 0, 0, 0];
		this._zoomLevel = this._camera.getZoomLevel()

		this._screenResize = false
		this._mouse_scroll_event = null
		this._mouse_click_event = null

		// attach event listeners
		this._docBody.addEventListener('keydown', 
						this._keyDown.bind(this), false); 

		this._docBody.addEventListener('keyup', 
						this._keyUp.bind(this), false);

		this._docBody.addEventListener('contextmenu', 
						this._rightClick.bind(this), false);

		this._docBody.addEventListener('mousedown',
						this._mouseDown.bind(this), false);

		this._docBody.addEventListener('mousemove',
						this._mouseHover.bind(this), false);

		this._window.addEventListener('resize', this._windowResize.bind(this));
		
		// get which in-menu button was pressed
		this._ui.addEventListener('mouseup', this._uiMenu.bind(this), false);
 	}


	_uiMenu(e){
		console.log(e.target.getAttribute('id'));
		//e.target.src = "imgs/house_red.png";
	}


	/**
	 * key pressed
	 */
	_keyDown(e){
		/* Map scrolling */
		let keys = Utils.keyboardKeys;
		if (e.keyCode == keys.UP || e.keyCode == keys.W) this._keycode[0] = 1
		if (e.keyCode == keys.DOWN || e.keyCode == keys.S) this._keycode[1] = 1
		if (e.keyCode == keys.LEFT || e.keyCode == keys.A) this._keycode[2] = 1
		if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) this._keycode[3] = 1

		/* zoom level */
		// zoom out
		if (e.keyCode == keys.MINUS || e.keyCode == keys.MINUS_firefox) {
			if (this._zoomLevel < 4)
				this._zoomLevel += 1
		}
		// zoom in
		if (e.keyCode == keys.PLUS || e.keyCode == keys.PLUS_firefox) {
			if (this._zoomLevel > 1)
				this._zoomLevel -= 1
		}

		/* Game pause & resume */
		if (e.keyCode == keys.P) {
			if (g_running == true)
				g_running = false
			else
				g_running = true
    	}
  	}// end of keyDown


	/**
	 * key no longer pressed 
	 */
	_keyUp(e){
		let keys = Utils.keyboardKeys;
		if (e.keyCode == keys.UP || e.keyCode == keys.W)   this._keycode[0] = 0
		if (e.keyCode == keys.DOWN || e.keyCode == keys.S) this._keycode[1] = 0
		if (e.keyCode == keys.LEFT || e.keyCode == keys.A) this._keycode[2] = 0
		if (e.keyCode == keys.RIGHT || e.keyCode == keys.D)this._keycode[3] = 0
	}
  

	/**
	 * overwrites the right click functionality
	 */
	_rightClick(e){
		e.preventDefault()
		console.log("right click!");
		return false
	}


	/**
	 * mouse button pressed
	 */
	_mouseDown(e){
		switch (e.which) {
			case 1: // left click
				this._mouse_click_event = e
				break;
			case 2: 
				// middle mouse button 
				break;
			case 3: 
				// right click has its own event listener (see above) 
				break;
			default:
				break;
    	}
	}


	/**
	 * mouse hovering
	 */
	_mouseHover(e){
		this._mouse_scroll_event = e	
	}


	/**
	 * window resize
	 */
	_windowResize(e){
		console.log('window resized');
		this._screenResize = true
	}


	getKeyCode(){
		return this._keycode
	}


	isScreenResized(){
		return this._screenResize 
	}


	setScreenResize(value){
		this._screenResize = value
	}


	getMouseClick(){
		return this._mouse_click_event
	}


	getMouseHover(){
		return this._mouse_scroll_event 
	}

	getZoomLevel(){
		return this._zoomLevel
	}


} // end of InputHandler

