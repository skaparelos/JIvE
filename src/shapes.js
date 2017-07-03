class Rectangle{

	constructor(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	getRect(){
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		};
	}

	containsPoint(x, y){
        return x >= this.x &&
			x <= this.x + this.w &&
			y >= this.y &&
			y <= this.y + this.h;
	}

}

class Circle{

	constructor(x, y, radius, offsetX, offsetY){
		this.x = x + offsetX;
		this.y = y + offsetY;
		this.r = radius;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	setPos(x, y){
		this.x = x + this.offsetX;
		this.y = y + this.offsetY;
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.stroke();
	}
}


class Ellipse{

	constructor(x, y, radiusX, radiusY, offsetX, offsetY){
		this.x = x + offsetX;
		this.y = y + offsetY;
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	setPos(x,y){
		this.x = x + this.offsetX;
		this.y = y + this.offsetY;
	}

	draw(ctx){
		ctx.beginPath();
		ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 45 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
		ctx.stroke();
	}

}


class Rhombus{

	constructor(x,y){
		this.x = x;
		this.y = y;
	}


	setPos(x,y){

	}

	draw(ctx){

	}
}