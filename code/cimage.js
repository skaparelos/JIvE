/**
 * cImage stands for custom Image
 */
class cImage {
	constructor(character, path){
		this._character = character
		this._loaded = false
		this._img = new Image()

		/* Once the image has been loaded set its width and height */
		var that = this
		this._img.onload = function () {
			that._width = this.width
			that._height = this.height
			that._loaded = true
		}

		this._img.src = 'imgs/' + path
	}


	getImage(){
		return this._img
	}


	getWidth(){
		return this._width
	}


	getHeight(){
		return this._height
	}


	draw(ctx, x, y, width, height){
		if (this._loaded == false)
			return

		ctx.drawImage(this._img, x, y, width, height)
	}

}
