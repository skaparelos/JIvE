class SpriteSheet{

	constructor(imageManager, ctx){
		this._frames = {}
		this._imageManager = imageManager
		this._ctx = ctx
	}


	/**
	 *  This function takes the name of a spritesheet image and the coordinates 
	 *  of each image in the sprite sheet. 
	 *
	 *  @param imageName - the name of the spritesheet image
	 *  @param frames - a dictionary of that form:
	 *  var frames = {
	 *  	"spriteName" : [x, y, width, height, anchorX, anchorY],
	 *		" ... " : [ ...]
	 *	}
	 *
	 *  spriteName is the name of the sprite in the sprite sheet.
	 *  e.g. if u have a spriteSheet image names "tiles", then you would name
	 *  each frame like this:
	 *  e.g. "red_tile", "blue_tile" 
	 *
	 *  
	 */
	load(imageName, frames){
		for (var i in frames){
			this._frames[i] = frames[i]
			this._frames[i].push(imageName)
		}
	}


	/**
	 *  Returns the dimensions of a frame (that is of sprite within a larger
	 *  image) e.g. if u have loaded a spritesheet with houses
	 *  you can get the dimensions of the 'blue-house'
	 *
	 */
	getFrameDimensions(frameName){
		var f = this._frames[frameName]
		return {
			width: f[SpriteSheet.WIDTH],
			height: f[SpriteSheet.HEIGHT]
		}
	}


	/**
	 *  Takes as input the name of the image to draw. it automatically finds
	 *  the spritesheet image where that sprite exists and draws the correct
	 *  portion
	 *  
	 *  @param frameName - the name of the sprite
	 *  @param x - the x coordinate to draw
	 *  @param y - the y coordinate to draw
	 *  @param width - the width of the image
	 *  @param height - the height of the image
	 *
	 */
	drawFrame(frameName, x, y, width, height){
		var f = this._frames[frameName]
		var img = this._imageManager.get(f[SpriteSheet.IMAGE_NAME])
		
		this._ctx.drawImage(img, f[SpriteSheet.X], f[SpriteSheet.Y],
			f[SpriteSheet.WIDTH], f[SpriteSheet.HEIGHT], x, y, width, height)
	}


	/**
	 *  Deletes the loaded spriteSheets
	 *
	 */
	clear(){
		this._frames = {}
	}
}

SpriteSheet.X = 0
SpriteSheet.Y = 1
SpriteSheet.WIDTH = 2
SpriteSheet.HEIGHT = 3
SpriteSheet.ANCHOR_X = 4
SpriteSheet.ANCHOR_Y = 5
SpriteSheet.IMAGE_NAME = 6
