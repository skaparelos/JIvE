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

		// used for loading images online in the map editor
		// start this from 1, to allow for the value 0
		// to be the isometric sketch map 
		this._imageID = 1
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
	 *  //TODO load to spritesheet as well
	 */
	load2MapEditor(key, path, panelName, callback){
		var img = new Image()
		var that = this

		var id = this._imageID
		this._imageID += 1

		// keep track of the name of the image
		if (!this._originalImageName) this._originalImageName = {}
		this._originalImageName[id] = key

		img.onload = function(){
			that._images[id] = img
			if(callback !== undefined)
				callback(panelName, img, id)
		}

		img.src = path

	}


	/**
	 *  This is used in the map editor to export all images in a tileset
	 *	
	 */
	exportToTileset(){
	
		if (!this._originalImageName) return;
	
		for(var i in this._images){
			console.log("id = " + i + ") " + this._originalImageName[i])
		}

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
