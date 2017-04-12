class Canvas{

	constructor(){
		this.canvas = null;
		this.ctx = null;
		return this;
	}

	initFullScreen(){
		this.initCanvas(0, 0, document.body.clientWidth, document.body.clientHeight);
		return this;
	}

	initCanvas(x, y, w, h){
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute("id", "JiveCanvas");

		// TODO manipulate css to set the correct coordinates
		// Code goes here...

		// this is to be able to change the position of the canvas
		this.canvas.className = "JiveCanvas";
		this.updateCanvasSize(w, h);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		return this;
	}

	updateCanvasSize(width, height) {
		// in the case that this function is called from 
		// the input handler, the input handler automatically
		// tries to pass an event as the first parameter
		// which is of type object. In that case just ignore it
		// and set the width correctly.
		if (typeof(width) === 'object')
			width = undefined

		this.canvas.width = width || document.body.clientWidth;
		this.canvas.height = height || document.body.clientHeight;
		this.ctx = this.canvas.getContext('2d');
		return this;
	}

	getWidth(){
		return this.canvas.width;
	}

	getHeight(){
		return this.canvas.height;
	}

	getCtx(){ return this.ctx; }
}