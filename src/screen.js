class Screen {

	constructor(width, height){
		this._FPS = g_game_settings["FPS"]
		this._period = 1000 / this._FPS // in millisec

		if (width === undefined)
			this.getFullWidth()
		else
			this._width = width

		if (height === undefined)
			this.getFullHeight()
		else
			this._height = height
	}


	getFullWidth(){
		this._width = document.body.clientWidth
	}


	getFullHeight(){
		this._height = document.body.clientHeight
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
