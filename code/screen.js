class Screen {
	constructor(width, height){
		this._width = width
		this._height = height
		this._FPS = 50
		this._period = 1000 / this._FPS // in millisec
		if (width == 0 && height == 0)
			this.getFullScreen()
	}


	getFullScreen() {
		this._width = document.body.clientWidth
		this._height = document.body.clientHeight
	}

	
	getWidth(){
		return this._width
	}

	
	getHeight(){
		return this._height
	}


	getPeriod(){
		return this._period
	}

}
