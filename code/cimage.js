/* cImage means custom Image. */
var cImage = function(character, path){
    this.character = character;
    this.img = new Image();
    this.img.src = 'imgs/' + path;
	this.width = this.img.width;
    this.height = this.img.height; 
};

var _unit_tile_width  = 128;
var _unit_tile_height = 64;

cImage.prototype.draw = function(ctx, col, row, changeX, changeY, zoom_level){
	var initX = (col - row) * _unit_tile_width/2;
	var initY = (row + col) * _unit_tile_height/2;
	var screenX = Math.round(initX/zoom_level) + changeX;
	var screenY = Math.round(initY/zoom_level) + changeY;
	ctx.drawImage(this.img, screenX, screenY);
};
