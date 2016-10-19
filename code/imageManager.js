/**
 * The ImageManager class is responsible for loading and accessing 
 * many images using a nickname. e.g. load an image 'house_blue_64x32_2.png'
 * and nickname it 'blue'
 */
class ImageManager {
	constructor(){
		this._images = {}
		
		// imgsLoaded holds the number of images that have been loaded
		this._imgsLoaded = 0
		// imgs2Load holds the number of images that have not been loaded yet
		this._imgs2Load = 0

		// if all images have been loaded this is equal to true
		// The user needs to make sure that no images are yet to be loaded
		this._loaded = false
	}


	/**
	 * This function is called to load images.
	 * The user can set a callback to be called once the images have been loaded
	 * @callback This is the callback function that will be called once 
     *           the image manager is done loading.
     *  
	 */
	load(imgs, callback){
		if (typeof callback !== "function" && callback !== undefined) 
			console.log("The callback must be a function")
		
		//get the number of images to load
		for(let i in imgs){
			this._imgs2Load += 1
		}

		for (let key in imgs){
			this._loadImage(key, imgs[key], callback)
		}
	}


	_loadImage(key, path, callback){
		var img = new Image()
		var that = this

		img.onload = function(){
			that._images[key] = img
			that._imgsLoaded += 1
			
			if (that._imgsLoaded === that._imgs2Load){
				that._loaded = true
				if(callback !== undefined)
					callback()
			}
		}

		img.src = 'imgs/' + path
	} 


	get(key){
		return this._images[key];
	}

	
	isDoneLoading(){
		return this._loaded
	}
	

	clear(){
		this._images = {}
	}
}
