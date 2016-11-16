// Represents the viewport
class Camera{

	constructor(){
		
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
		for (var key in buttons){
			var value = buttons[key]
			if (keyAction[value] === true)
				return true
		}
		return false
	}


	/**
	 *  Moves the camera if it can and returns true if a movement really 
	 *  happened, false otherwise.
	 */
	move(keyAction, dt){
		var keys = Utils.keyboardKeys

		var UP    = this._checkButtonPressed(keyAction, this._upButtons)
		var DOWN  = this._checkButtonPressed(keyAction, this._downButtons)
		var LEFT  = this._checkButtonPressed(keyAction, this._leftButtons)
		var RIGHT = this._checkButtonPressed(keyAction, this._rightButtons)

		if (DOWN || UP || LEFT || RIGHT){
    
			var dx = 0
			var dy = 0
			  
			if (UP)    dy =  this._scrollingSpeed * dt
			if (DOWN)  dy = -this._scrollingSpeed * dt
			if (LEFT)  dx =  this._scrollingSpeed * dt
			if (RIGHT) dx = -this._scrollingSpeed * dt

			// update the position of the viewport 
			this._x += dx
			this._y += dy

		}
		return this
	}


	getPos(){
		return {
			x: this._x,
			y: this._y
		};
	}


	getZoomLevel(){
		return this._zoomLevel
	}


	increaseZoomLevel(){
		if (!this._isZoomChangeAllowed())
			return -1;

		if (this._zoomLevel > 1)
			this._zoomLevel -=1
		
		return this._zoomLevel
	}


	decreaseZoomLevel(){
		if (!this._isZoomChangeAllowed())
			return -1;

		this._zoomLevel +=1
		return this._zoomLevel
	}


	_isZoomChangeAllowed(){
		if(this._allowChangeInZoom){
			return true
		}else{
			console.log("changing the zoom level is not allowed. Check the configuration file")
			return false
		}
	}


	setZoomLevel(value){
		if (this._isZoomChangeAllowed())
			this._zoomLevel = value

		return this
	}	

}
