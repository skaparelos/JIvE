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
	move(keycode){
		let keys = Utils.keys 

    	if (keycode[keys.UP] == 1 || keycode[keys.DOWN] == 1 ||
            	keycode[keys.LEFT] == 1 || keycode[keys.RIGHT] == 1) {
     
			var dx = 0
			var dy = 0
			  
			if (keycode[keys.UP] == 1) dy = this._scrollingSpeed
			if (keycode[keys.DOWN] == 1) dy = -this._scrollingSpeed
			if (keycode[keys.LEFT] == 1) dx = this._scrollingSpeed
			if (keycode[keys.RIGHT] == 1) dx = -this._scrollingSpeed

			// update tiles the drawing position of each tile
			this._changeX += dx
			this._changeY += dy
			return true
		}
		return false
	}


	/**
	 *  Returns the change in the X and Y axes
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
