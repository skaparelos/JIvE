class Camera{
	constructor(zoomLevel){
		this._changeX = 0;
		this._changeY = 0;
		this._scrollingSpeed = 30;
		this._zoomLevel = zoomLevel
	}


	/**
	 *  Moves the camera if it can and returns true if a movement really 
	 *  happened, false otherwise.
	 */
	move(keyAction){
		let keys = Utils.keyboardKeys
	
		let DOWN  = keyAction[keys.S] || keyAction[keys.DOWN]
		let UP    = keyAction[keys.W] || keyAction[keys.UP]
		let LEFT  = keyAction[keys.A] || keyAction[keys.LEFT] 
		let RIGHT = keyAction[keys.D] || keyAction[keys.RIGHT]

    	if (DOWN || UP || LEFT || RIGHT){
    
			var dx = 0
			var dy = 0
			  
			if (UP) dy = this._scrollingSpeed
			if (DOWN) dy = -this._scrollingSpeed
			if (LEFT) dx = this._scrollingSpeed
			if (RIGHT) dx = -this._scrollingSpeed

			// update tiles the drawing position of each tile
			this._changeX += dx
			this._changeY += dy
			return true
		}
		return false
	}


	/**
	 *  Returns the change in the X and Y axes
	 *  i.e. how much has the camera moved
	 */
	getChange(){
		return {
			changeX: this._changeX,
			changeY: this._changeY
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
		this._zoomLevel = value
	}	

}
