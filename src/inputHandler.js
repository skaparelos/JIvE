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

		// the two things we will add event listeners on:
		this._docBody = document.body
		this._window = window

		// holds the key pressed
		this._keyAction = {}

		// holds the mouse buttons pressed
		this._mouseAction = {}
	
		// Mouse Events
		this._mouseScrollEvent = null
		this._leftMouseClickEvent = null

		// Window Event
		this._screenResize = false

		// set event listener
		this._attachEventListeners()
 	}


	_attachEventListeners(){

		// Keyboard
		this._docBody.addEventListener('keydown', this._keyDown.bind(this), false) 
		this._docBody.addEventListener('keyup', this._keyUp.bind(this), false)
	
		// Mouse
		this._docBody.addEventListener('contextmenu', this._rightClick.bind(this), false)
		this._docBody.addEventListener('mousedown', this._mouseDown.bind(this), false)
		this._docBody.addEventListener('mouseup', this._mouseUp.bind(this), false)
		this._docBody.addEventListener('mousemove', this._mouseHover.bind(this), false)

		// Window
		this._window.addEventListener('resize', this._windowResize.bind(this))
		
	}


	/**
	 * key pressed
	 */
	_keyDown(e){
		this._keyAction[e.keyCode] = true
	}


	/**
	 * key no longer pressed 
	 */
	_keyUp(e){
		this._keyAction[e.keyCode] = false
	}
	

	/**
	 * overwrites the right click functionality
	 */
	_rightClick(e){
		e.preventDefault()
	}


	/**
	 *  mouse button pressed
	 */
	_mouseDown(e){
		this._mouseAction[e.button] = true
		switch (e.which) {

			case 1: // left click
				this._leftMouseClickEvent = e
				break;
			case 2:  break;	// middle mouse button
			case 3:  break; // right click has its own event listener (see above)
			default: break;
    	}
	}


	/**
	 *  mouse button no longer pressed
	 */
	_mouseUp(e){
		this._mouseAction[e.button] = false
	}


	/**
	 * mouse hovering
	 */
	_mouseHover(e){
		this._mouseScrollEvent = e	
	}


	/**
	 * window resize
	 */
	_windowResize(e){
		console.log('window resized');
		this._screenResize = true
	}


	getKeyAction(){
		return this._keyAction
	}

	getMouseAction(){
		return this._mouseAction
	}

	getMouseHover(){
		return this._mouseScrollEvent 
	}

	getLeftMouseClick(){
		return this._leftMouseClickEvent
	}

	isScreenResized(){
		let temp = this._screenResize
		this._screenResize = false
		return temp
	}

	setScreenResize(value){
		this._screenResize = value
	}

} // end of InputHandler

