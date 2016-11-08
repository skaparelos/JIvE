// More like Viewport rather than camera.
class Camera{
	constructor(zoomLevel){
		
		// Set the viewport to the origin	
		this._x = 0
		this._y = 0

		this._scrollingSpeed = g_camera_settings["scrollingSpeed"]
		this._zoomLevel = g_camera_settings["initialZoomLevel"]
		this._allowChangeInZoom = g_camera_settings["allowChangeInZoomLevel"]

		this._upButtons    = g_camera_settings["UP"]
		this._downButtons  = g_camera_settings["DOWN"]
		this._leftButtons  = g_camera_settings["LEFT"]
		this._rightButtons = g_camera_settings["RIGHT"]
	}


	_checkButtonPressed(keyAction, buttons){
		for (let key in buttons){
			let value = buttons[key]
			if(keyAction[value] === true)
				return true
		}
		return false
	}


	/**
	 *  Moves the camera if it can and returns true if a movement really 
	 *  happened, false otherwise.
	 */
	move(keyAction, dt){
		let keys = Utils.keyboardKeys

		/*
		let UP    = keyAction[keys.W] || keyAction[keys.UP]
		let DOWN  = keyAction[keys.S] || keyAction[keys.DOWN]
		let LEFT  = keyAction[keys.A] || keyAction[keys.LEFT] 
		let RIGHT = keyAction[keys.D] || keyAction[keys.RIGHT]
		*/

		let UP    = this._checkButtonPressed(keyAction, this._upButtons)
		let DOWN  = this._checkButtonPressed(keyAction, this._downButtons)
		let LEFT  = this._checkButtonPressed(keyAction, this._leftButtons)
		let RIGHT = this._checkButtonPressed(keyAction, this._rightButtons)

		if (DOWN || UP || LEFT || RIGHT){
    
			var dx = 0
			var dy = 0
			  
			if (UP)    dy =  this._scrollingSpeed * dt
			if (DOWN)  dy = -this._scrollingSpeed * dt
			if (LEFT)  dx =  this._scrollingSpeed * dt
			if (RIGHT) dx = -this._scrollingSpeed * dt

			// update the position of the viewpoer 
			this._x += dx
			this._y += dy

		}

		return this
	}



	/**
	 *  Returns the position of the viewport
	 */
	getPos(){
		return {
			x: this._x,
			y: this._y
		};
	}


	getZoomLevel(){
		return this._zoomLevel
	}


	/**
	 *  Update the zoomLevel when it changes
	 */
	//TODO when a change is made update this 
	setZoomLevel(value){
		if (this._allowChangeInZoom)
			this._zoomLevel = value
		else
			console.log("changing the zoom level is not allowed. Check the configuration file")
		return this
	}	

}
