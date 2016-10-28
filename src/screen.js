class Screen {
	constructor(width, height){
		this._width = width
		this._height = height
		this._FPS = g_game_settings["FPS"]
		this._period = 1000 / this._FPS // in millisec
		if (width == 0 && height == 0)
			this.getFullScreen()
	}


	getFullScreen() {
		this._width = document.body.clientWidth
		this._height = document.body.clientHeight
		return {
			width: this._width,
			height: this._height
		}
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


	getFPS(){
		return this._FPS
	}

}
