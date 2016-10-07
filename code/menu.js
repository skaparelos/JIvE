function main () {
	// init_menu();
  init_world();
  //var p = new Point();
  //console.log("point created");
};

function init_menu () {
	// TODO
	// this is the main menu, not the in-game menu
};

function Point(){
  this.X = 0;
  this.Y = 0;
  this.canvas = document.createElement('canvas');
  this.canvas.width = 500;
  this.canvas.height = 500;
  this.area = document.body;
  this.area.addEventListener('mousemove', this.mouseMove.bind(this), false);              
};

Point.prototype.mouseMove = function(m){
  console.log("hehe");
}


function init_world () {
  var world = new World(0, 0) // (0,0) means full screen
  world.start()
};
