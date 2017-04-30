var JIVE = {};

// these two are used to hide some basic functionality
// from the user and let him/her deal only with more 
// important stuff. for the user making a canvas element
// is not important, neither is making the imageLoader
JIVE._imageLoader = new ImageLoader();
JIVE._canvas = new Canvas();


JIVE._onDocumentLoad = function (){

	// make this call here so that the body has been loaded
	// so we can access document.body
	JIVE._canvas.initFullScreen();

	// calls the user defined init() function
	init();
}

// when the body loads call this function
window.onload = JIVE._onDocumentLoad;

JIVE.Map = function () {
	return new TiledMap();
};

JIVE.Renderer = function (canvas){
	return new Renderer(canvas);
};

JIVE.Canvas = function (){
	return new Canvas();
};

JIVE.Entity = function (x, y, gid){
	return new Entity(x, y, gid);
}

JIVE.ImageLoader = function () {
	return new ImageLoader();
}

JIVE.Camera = function () {
	return new Camera();
}

JIVE.InputHandler = function (){
	return new InputHandler();
}

JIVE.reqAnimFrame = function(fn){

	// reqAnimFrame is capped to 60FPS. In order to control FPS, we call
	// the drawing function every _period (see the if below)
	requestAnimationFrame(function (){
		JIVE.reqAnimFrame(fn);
	});

	var now = Date.now()
	this._then = this._then || 0;
	this._deltaTime = now - this._then;

	if (this._deltaTime >= 17) {

		//this.update(this._deltaTime)
		//this.draw()
		fn(this._deltaTime)

		this._then = now - (this._deltaTime % 16)
	} 
}

JIVE.settings = {}

JIVE.Keys = {

	// arrows
	ARROW_UP: 38,
	ARROW_DOWN: 40,
	ARROW_LEFT: 37,
	ARROW_RIGHT: 39,

	// numbers
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,

	// alphabet
	Q: 81,
	W: 87,
	E: 69,
	R: 82,
	T: 84,
	Y: 89,
	U: 85,
	I: 73,
	O: 79,
	P: 80,
	A: 65,
	S: 83,
	D: 68,
	F: 70,
	G: 71,
	H: 72,
	J: 74,
	K: 75,
	L: 76,
	Z: 90,
	X: 88,
	C: 67,
	V: 86,
	B: 66,
	N: 78,
	M: 77,

	// others
	ESC: 27,
	PLUS: 187,
	MINUS: 189,
	PLUS_firefox: 61, // firefox has different codes
 	MINUS_firefox: 173, // firefox has different codes

	"=": 187,
	"-": 189
}


JIVE.Mouse = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2,
}