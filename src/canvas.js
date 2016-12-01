class Canvas{

    constructor(width, height){
        this._canvas = null;
        this._context = null;
        this._canvasOffsetTop = 0;
        this._canvasOffsetLeft = 0;
        this._initCanvas(width, height);
    }

    _initCanvas(width, height){

        // TODO remove corresponding code from world.js
        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute("id", "myCanvas");

        // this is to be able to change its position
        this._canvas.className = "myCanvas";
        this.updateCanvasSize(width, height);
    }


    init(){
        document.body.insertBefore(this._canvas, document.body.childNodes[0]);
        // TODO remove corresponding code from map.js
        var canv = document.getElementById('myCanvas').getBoundingClientRect();
        this._canvasOffsetTop = canv.top;
        this._canvasOffsetLeft = canv.left
    }


    /**
     *  updates the canvas size
     */
    updateCanvasSize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        this._context = this._canvas.getContext('2d');
    }


    getCanvas(){
        return{
            canvas: this._canvas,
            ctx: this._context,
            canvasOffsetTop: this._canvasOffsetTop,
            canvasOffsetLeft: this._canvasOffsetLeft
        };
    }


    getCtx(){
        return this._context;
    }

}
