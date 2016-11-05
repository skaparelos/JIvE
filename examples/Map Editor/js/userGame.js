/**
 * This file is to be manipulated by the users of JIvE
 * to contain the game and the menu logic
 */


/**
 * This is the main entry point
 */

var world;
var worldImageManager;
var worldSpriteSheetManager;

function main() {
	world = new World(0, 0)
	worldImageManager = world.getImageManager();
	worldSpriteSheetManager = world.getSpriteSheet();
}

function imageLoaded(){
	console.log("image loaded!!")
}


// function taken from https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
function previewFiles() {

  var preview = document.querySelector('#preview');
  var files   = document.querySelector('input[type=file]').files;

  function readAndPreview(file) {

    // Make sure `file.name` matches our extensions criteria
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
      var reader = new FileReader();

      reader.addEventListener("load", function () {

		var tileWidth = document.querySelector('#tile_width');
      	var tileWidth = document.querySelector('#tile_height');

		var img = worldImageManager.load2MapEditor(file.name, this.result, imageLoaded);

        //var image = new Image();
        //image.height = 200;
        //image.title = file.name;
        //image.src = this.result;
        preview.appendChild(img);
      }, false);

      reader.readAsDataURL(file);
    }

  }

  if (files) {
    [].forEach.call(files, readAndPreview);
  }

}


