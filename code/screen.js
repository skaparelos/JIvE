var Screen = function(width, height){
	this.width = width;
	this.height = height;
	this.FPS = 70;
	this.period = Math.floor(1000 / this.FPS) + 1; //in millisec
};


Screen.prototype.get_fullscreen = function(){
	//take client's screen size
   	this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
};
