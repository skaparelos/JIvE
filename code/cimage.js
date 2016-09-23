/* cImage means custom Image. */
var cImage = function(character, path){
	this.character = character;
	this.loaded = false;
	this.img = new Image();

	/* Once the image has been loaded set its width and height */
	var that = this;
	this.img.onload = function(){
		that.width_ = this.width;
		that.height_ = this.height;
		that.loaded = true;	
	};

	this.img.src = 'imgs/' + path;
};

var _unit_tile_width  = 128;
var _unit_tile_height = 64;

cImage.prototype.draw = function(ctx, col, row, changeX, changeY, zoom_level){

	/* make sure the image has loaded */
	if (this.loaded == false)
		return ;

	var initX = (col - row) * _unit_tile_width/2;
	var initY = (row + col) * _unit_tile_height/2;
	var screenX = Math.round(initX/zoom_level + changeX);
	var screenY = Math.round(initY/zoom_level + changeY);

	//calculate the new tile width and height based on the zoom level
	var tWidthZoom = Math.round(this.width_/zoom_level);
    var tHeightZoom = Math.round(this.height_/zoom_level);

	ctx.drawImage(this.img, screenX, screenY, tWidthZoom, tHeightZoom);
};
