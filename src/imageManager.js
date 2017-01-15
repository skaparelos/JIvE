/**
 * The ImageManager class is responsible for loading and accessing 
 * many images using a nickname. e.g. load an image 'house_blue_64x32_2.png'
 * and nickname it 'blue-house'
 */
class ImageManager {

	constructor(){
		this._images = {};
		
		// holds the number of images that have been loaded
		this._imgsLoaded = 0;

		// holds the number of images that have been identified
		// for loading but have not been loaded yet
		this._imgs2Load = 0;

		// If all images from those identified for loading have been loaded 
		// then, this is equal to true.
		this._loaded = false;

		// holds the root folder to look for images in
		this._imagesPath = g_game_settings["IMAGES_DIR"];
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
	load(imgs, spriteSheet, callback){

		if (typeof callback !== "function" && callback !== undefined) 
			console.log("The callback to the load function is not a function");
		
		//get the number of images to load
		for(let i in imgs){
			this._imgs2Load += 1;
		}

		for (let key in imgs){

			// if the user is trying to load a single image instead of spritesheet
            // in that, treat it as a spritesheet with frames
            // equal to the size of the image
			if (imgs[key].length == 1) {

				// this needs a callback function since we set the frame
				// to be the size of the image, but we cannot know the size of
				// the image in advance, because it has not been loaded.
				// we must wait for onload to load the image
                this._loadImage(key, imgs[key], callback, function(img){
                    var tempFrame = {};
                    tempFrame[key] = [0, 0, img.width, img.height, 0, 0];
                    spriteSheet.load(key, tempFrame);
				});
            }

			// if the user is trying to load a spritesheet
			if (imgs[key].length == 2) {
                this._loadImage(key, imgs[key][0], callback)
				spriteSheet.load(key, imgs[key][1]);

            }

		}
	}


    /**
	 * Due to how closure work we had to create this function which actually
	 * loads an image to the image manager. This is called by the load()
	 * function above for each to be loaded.
	 *
     * @param key
     * @param path
     * @param callback
     * @private
     */
	_loadImage(key, path, callback, innerCallback = undefined){
		var img = new Image();
		var that = this;

		img.onload = function(){
			that._images[key] = img;
			that._imgsLoaded += 1;

			// before removing this from here remember that img.onload is async
			if (that._imgsLoaded === that._imgs2Load){
				that._loaded = true;
				if(callback !== undefined) {
					if (innerCallback !== undefined)
						innerCallback(this);
                    callback();
                }
			}
		}

		img.src = this._imagesPath + path;
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
	load2MapEditor(key, path, callback){

		var img = new Image();
		var that = this;

		img.onload = function(){
			that._images[key] = img;
			if(callback !== undefined)
				callback(img, key);
		}

		img.src = path;
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
		this._images = {};
	}

}
