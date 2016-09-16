/* cImage means custom Image. */
var cImage = function(character, path){
    this.character = character;
    this.img = new Image();
    this.img.src = 'imgs/' + path;
	this.width = this.img.width;
    this.height = this.img.height; 
};


cImage.prototype.draw = function(ctx, i, j, changeX, changeY){
	ctx.drawImage(this.img, i*this.width + changeX, j*this.height + changeY);
	//console.log("Draw!!");
};
