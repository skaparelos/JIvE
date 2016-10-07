class InputHandler{

	constructor(world, window, document_body){
		this._world = world
		this._doc_body = document_body
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
			PLUS_firefox: 61, // firefox has different codes
			MINUS_firefox: 173,
			PLUS: 187,
			MINUS: 189
		};
		this._screen_resize = false
		this._mouse_scroll_event = null
		this._mouse_click_event = null

		// attach event listeners
		this._doc_body.addEventListener('keydown', 
						this._key_down.bind(this), false); 

		this._doc_body.addEventListener('keyup', 
						this._key_up.bind(this), false);

		this._doc_body.addEventListener('contextmenu', 
						this._right_click.bind(this), false);

		this._doc_body.addEventListener('mousedown',
						this._mouse_down.bind(this), false);

		this._doc_body.addEventListener('mousemove',
						this._mouse_hover.bind(this), false);

		window.addEventListener('resize',
						this._window_resize.bind(this));
		

  }

	/**
	 * key pressed
	 */
	_key_down(e){
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
	_key_up(e){
		let keys = this._keys
		if (e.keyCode == keys.UP || e.keyCode == keys.W)   this._keycode[0] = 0
		if (e.keyCode == keys.DOWN || e.keyCode == keys.S) this._keycode[1] = 0
		if (e.keyCode == keys.LEFT || e.keyCode == keys.A) this._keycode[2] = 0
		if (e.keyCode == keys.RIGHT || e.keyCode == keys.D)this._keycode[3] = 0
	}
  
	/**
	 * overwrites the right click functionality
	 */
	_right_click(e){
		e.preventDefault()
		console.log("right click!");
		return false
	}

	/**
	 * mouse button pressed
	 */
	_mouse_down(e){
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
	_mouse_hover(e){
		this._mouse_scroll_event = e	
	}

	/**
	 * window resize
	 */
	_window_resize(e){
		console.log('window resized');
		this._screen_resize = true
	}

	get_keycode(){
		return this._keycode
	}

	get_screen_resized(){
		return this._screen_resize 
	}

	get_mouse_click(){
		return this._mouse_click_event
	}

	get_mouse_hover(){
		return this._mouse_scroll_event 
	}
} // end of InputHandler

