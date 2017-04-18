
/**
* This class is responsible for loading images.
*/
class ImageLoader {

	constructor(){

		// Holds the names of the images loaded
		// and their Img objects. The loaded images can be
		// atlases, spritesheets, or self-contained images.
		// {"imageName": imageObject}
		this.images = {};

		return this;
	}


	/**
	* Given an image name return the image object
	* if it has been loaded
	*/
	get(imageName){
		return this.images[imageName];
	}


	/**
	* use this function to load a list of images given in
	* text strings. e.g.
	* imgsLoadList = ["image1.png", "imgs/img3.png"]
	* 
	* @param imgsLoadList, a list of strings containing the image path.
	* @param callback, a function to call once done with loading
	*/
	loadImages(imgsLoadList, callback){

		if (typeof callback !== "function" && callback !== undefined) 
			console.log("The callback to the load function is not a function");

		var imgLoaded = 0;
		var totalLoad = imgsLoadList.length;

		for (var i = 0; i < totalLoad; i++){
			var imgName = imgsLoadList[i];

			// if this images has not been loaded, load it
			if (this.images[imgName] == null){
				var img = new Image();

				img.onload = function(){
					imgLoaded++;
					if(imgLoaded == totalLoad)
						callback();
				}

				img.src = imgName;
				this.images[imgName] = img;

			}else{
				// if it has already been loaded, don't load it
				imgLoaded++;
				if(imgLoaded == totalLoad)
					callback();
			}
		}
	}
}
