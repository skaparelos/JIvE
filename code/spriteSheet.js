class SpriteSheet{
	constructor(){
		this._frames = {}
	}


	/**
	 *  This function takes a spritesheet image and the coordinates 
	 *  of each image in the sprite sheet. 
	 *  frames is an dictionary of that form:
	 *
	 *  spriteName is the name of the sprite. e.g. "red_tile", "blue_tile"
	 *  var frames = {
	 *  	"spriteName" : [x, y, width, height, anchorX, anchorY],
	 *		" ... " : [ ...]
	 *	}
	 */
	load(image, frames){
		for (let i in frames){
			this._frames[i] = frames[i]
			// TODO keep this only once, not for every frame
			this._frames[i].push(image)
		}
	}


	drawFrame(frameName, ctx, x, y, width, height){
		var f = this._frames[frameName]
		ctx.drawImage(f[SpriteSheet.IMAGE], f[SpriteSheet.X], f[SpriteSheet.Y],
			f[SpriteSheet.WIDTH], f[SpriteSheet.HEIGHT], x, y, width, height)
	}


	clear(){
	}
}

SpriteSheet.X = 0
SpriteSheet.Y = 1
SpriteSheet.WIDTH = 2
SpriteSheet.HEIGHT = 3
SpriteSheet.ANCHOR_X = 4
SpriteSheet.ANCHOR_Y = 5
SpriteSheet.IMAGE = 6
