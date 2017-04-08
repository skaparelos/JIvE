class Canvas{

	constructor(){
		this.canvas = null;
		this.ctx = null;
	}

	initFullScreen(){
		this.initCanvas(0, 0, document.body.clientWidth, document.body.clientHeight);
	}


    initCanvas(x, y, w, h){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("id", "myCanvas");

        // this is to be able to change the position of the canvas
        this.canvas.className = "myCanvas";
        this.updateCanvasSize(w, h);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
    }

    getCtx(){ return this.ctx; }
}