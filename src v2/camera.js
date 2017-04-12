class Camera extends EventEmitter{

	constructor(x, y, w, h, ss, zl){

		super();

		// these dimensions are in tiles.
		// i.e. the camera shows all tiles from
		// the (0,0) to (w,0) and (0,0) to (0,h)
		// this is useful in drawing as can directly
		// draw from x to x+w and from y to y+h.
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 10;
		this.h = h || 10;

		// this gotta be in pixels to allow for 
		// smooth scrolling. For every scroll that we make
		// we need to make sure that if the total scroll
		// in pixels is bigger than the width or the height
		// of the tiles
		this.pixelX = 0;
		this.pixelY = 0;
		this.scrollingSpeed = ss || 0.0001;
		this.zoomLvl = zl || 1;

		return this;
	}


	getCamera(){
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h,
			zoomLvl: this.zoomLvl
		}
	}


	/**
	*
	* @param direction - an object {left:1, right:0, up:0, down:1}
	*
	*/
	move(direction, dt){

		// change in x, y
		var dx = 0;
		var dy = 0;

		if (direction.left)  dx = this.scrollingSpeed * dt;
		if (direction.right) dx = - this.scrollingSpeed * dt;
		if (direction.up)    dy = this.scrollingSpeed * dt;
		if (direction.down)  dy = - this.scrollingSpeed * dt;

		this.pixelX += dx;
		this.pixelY += dy;

		this.x = Math.floor(this.pixelX / 64 /*tilewidth*/);
		this.y = Math.floor(this.pixelY / 32 /*tileheight*/);

		return this;
	}

	setX(x){
		this.x = x;
		return this;
	}

	setY(y){
		this.y = y;
		return this;
	}

	setW(w){
		this.w = w;
		return this;
	}

	setH(h){
		this.h = h;
		return this;
	}



}