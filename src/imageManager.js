/**
 * The ImageManager class is responsible for loading and accessing 
 * many images using a nickname. e.g. load an image 'house_blue_64x32_2.png'
 * and nickname it 'blue-house'
 */
class ImageManager {
	constructor(){
		this._images = {}
		
		// holds the number of images that have been loaded
		this._imgsLoaded = 0

		// holds the number of images that have not been identified
		// for loading but have not been loaded yet
		this._imgs2Load = 0

		// If all images from those identified for loading have been loaded 
		// then, this is equal to true.
		this._loaded = false

		this._imagesPath = g_game_settings["IMAGES_DIR"]
	}


	/**
	 * This function is called to load images.
	 * The user can set a callback to be called once the images have been loaded
	 *
	 * @imgs     a dictionary of the form { "imageNickName" : "path" }
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

		img.src = this._imagesPath + path
	} 


	/**
	 *  This function is used to load images by loading them using a 'browse'
	 *  menu.
	 *  
	 *  This function was created to be used with the online map editor. It 
	 *  could have other functionality as well, but this is what it is mainly 
	 *  used for right now.
	 */
	load2MapEditor(key, path, panel, callback){
		var img = new Image()
		var that = this

		img.onload = function(){
			that._images[key] = img
			
			if(callback !== undefined)
				callback(panel, img)
		}

		img.src = path

		return img
	}


	get(key){
		return this._images[key];
	}


	/**
	 *  Can be used to check whether images have been loaded.
	 *  Notice that in most cases it is better to use a callback function
	 *  when you are using the load() function (see above)
	 */	
	isDoneLoading(){
		return this._loaded
	}
	

	clear(){
		this._images = {}
	}

}
