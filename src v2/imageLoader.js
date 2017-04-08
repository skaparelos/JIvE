
/**
  This class is responsible for loading images
*/
class ImageLoader {

	constructor(){
		this.images = {};
	}

	get(imageName){
		return this.images[imageName];
	}

	loadImages(imgsLoadList, callback){

		if (typeof callback !== "function" && callback !== undefined) 
			console.log("The callback to the load function is not a function");

		var imgLoaded = 0;
		var totalLoad = imgsLoadList.length;

		for (var i = 0; i < totalLoad; i++){
			var imgName = imgsLoadList[i];
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
				imgLoaded++;
				if(imgLoaded == totalLoad)
					callback();
			}
		}
	}
}
