class Utils{
	
	static measureFunctionSpeed(callback){
		start = new Date().getTime();

		let maxCount = 500
		for (var n = 0; n < maxCount; n++) {
  			callback();
		}

		elapsed = new Date().getTime() - start;
		console.log("Time Elapsed: " + elapsed);
	}

	
	static keyCode2KeyChar(keyCode){
		return String.fromCharCode(keyCode) 
	}

	static key(keyChar){
		return this.keyboardKeys[keyChar]
	}
	
}



Utils.keys = {
	UP : 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3
}


Utils.keyboardKeys =  {

	// arrows
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,

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


var fake_event = {
  clientX: -1,
  clientY: -1
}



