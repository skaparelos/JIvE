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


cImage.prototype.draw = function(ctx, col, row, changeX, changeY, zoom_level){

	/* make sure the image has is loaded */
	if (this.loaded == false)
		return ;

	/* Map to World coords conversion */
	var initX = (col - row) * g_unit_tile_width/2;
	var initY = (row + col) * g_unit_tile_height/2;
	var screenX = Math.floor(initX/zoom_level + changeX);
	var screenY = Math.floor(initY/zoom_level + changeY);

	//calculate the new tile width and height based on the zoom level
	var t_width_zoom  = Math.floor(this.width_/zoom_level);
	var t_height_zoom = Math.floor(this.height_/zoom_level);

	ctx.drawImage(this.img, screenX, screenY, t_width_zoom, t_height_zoom);
};
