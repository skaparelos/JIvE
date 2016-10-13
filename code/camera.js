class Camera{
	constructor(){
		this._changeX = 0;
		this._changeY = 0;
		this._scrollingSpeed = 30;
	}


	/**
	 *  Moves the camera if it can and returns true if if a movement really 
	 *  happened, false otherwise
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

	getChange(){
		return {
			changeX: this._changeX,
			changeY: this._changeY
		};
	}
		

}
