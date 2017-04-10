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
		this.canvas.setAttribute("id", "myCanvas");

		// this is to be able to change the position of the canvas
		this.canvas.className = "myCanvas";
		this.updateCanvasSize(w, h);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		return this;
	}

	updateCanvasSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');
		return this;
	}

	getCtx(){ return this.ctx; }
}