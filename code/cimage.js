/* cImage means custom Image. */
var cImage = function(character, path){
    this.character = character;
    this.img = new Image();
    this.img.src = 'imgs/' + path;
	this.width = this.img.width;
    this.height = this.img.height; 
};


cImage.prototype.draw = function(ctx, i, j){
	ctx.drawImage(this.img, 10, 10);
	//console.log("Draw!!");
};
