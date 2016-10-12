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
	constructor(){
		// the three things we will add event listeners on:
		this._ui = document.getElementById('ui')
		this._doc_body = document.body
		this._window = window

		// up, down, left, right, zoom_level
		this._keycode = [0, 0, 0, 0, 2];
		this._keys =  {
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
			PLUS: 187,
			MINUS: 189,
			// firefox has different codes
			PLUS_firefox: 61, 
			MINUS_firefox: 173
		};

		this._screenResize = false
		this._mouse_scroll_event = null
		this._mouse_click_event = null

		// attach event listeners
		this._doc_body.addEventListener('keydown', 
						this._keyDown.bind(this), false); 

		this._doc_body.addEventListener('keyup', 
						this._keyUp.bind(this), false);

		this._doc_body.addEventListener('contextmenu', 
						this._rightClick.bind(this), false);

		this._doc_body.addEventListener('mousedown',
						this._mouseDown.bind(this), false);

		this._doc_body.addEventListener('mousemove',
						this._mouseHover.bind(this), false);

		this._window.addEventListener('resize', this._windowResize.bind(this));
		
		// get which in menu button was pressed
		this._ui.addEventListener('mouseup', this._uiMenu.bind(this), false);

 	}


	_uiMenu(e){
		console.log(e.target.getAttribute('id'));
		e.target.src = "imgs/house_red.png";
	}


	/**
	 * key pressed
	 */
	_keyDown(e){
		/* Map scrolling */
		let keys = this._keys
		if (e.keyCode == keys.UP || e.keyCode == keys.W) this._keycode[0] = 1
		if (e.keyCode == keys.DOWN || e.keyCode == keys.S) this._keycode[1] = 1
		if (e.keyCode == keys.LEFT || e.keyCode == keys.A) this._keycode[2] = 1
		if (e.keyCode == keys.RIGHT || e.keyCode == keys.D) this._keycode[3] = 1

		/* zoom level */
		// zoom out
		if (e.keyCode == keys.MINUS || e.keyCode == keys.MINUS_firefox) {
			if (this._keycode[4] < 4)
				this._keycode[4]++
		}
		// zoom in
		if (e.keyCode == keys.PLUS || e.keyCode == keys.PLUS_firefox) { 
			if (this._keycode[4] > 1)
				this._keycode[4]--
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
		let keys = this._keys
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
			break
		case 2: /* middle mouse button */ break
		case 3: /* right click has its own event listener (see above) */ break
		/* default:   alert("You have a strange mouse!"); */
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

	get_mouse_click(){
		return this._mouse_click_event
	}

	get_mouse_hover(){
		return this._mouse_scroll_event 
	}

	set_zoom_level(level){
		this._keycode[4] = level
	}
	
	get_zoom_level(){
		return this._keycode[4]
	}
} // end of InputHandler

