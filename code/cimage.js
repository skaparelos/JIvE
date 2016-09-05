/* cImage means custom Image. */
var cImage = function(_character, _path){
    this.character = _character;
    this.img = new Image();
    this.img.src = 'imgs/' + _path;
};

cImage.prototype.draw = function(){

};
