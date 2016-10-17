/**
 * The ImageManager class is responsible for loading and accessing 
 * many images using a nickname. e.g. load an image 'house_blue_64x32_2.png'
 * and nickname it 'blue'
 */
class ImageManager {
	constructor(){
		this._images = {}
	}

	load(imgs){
		for (var i in imgs){
			this._images[i] = new cImage(-1, imgs[i])
		}
	}

	get(key){
		return this._images[key];
	}
	
	clear(){
		this._images = {}
	}
}
