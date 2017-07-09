class Point{

	constructor(x, y){
		this.x = x;
		this.y = y;
		return this;
	}

	equal(pt){
		return this.x === pt.x && this.y === pt.y;
	}

	sameX(pt){
		return this.x === pt.x;
	}

	sameY(pt){
		return this.y === pt.y;
	}

	add(pt){
		this.x += pt.x;
		this.y += pt.y;
		return this;
	}

	subtract(pt){
		this.x -= pt.x;
		this.y -= pt.y;
		return this;
	}

	absSubtract(pt){
		return new Point(Math.abs(this.x - pt.x), Math.abs(this.y - pt.y));
	}

	update(x, y){
		this.x = x;
		this.y = y;
		return this;
	}

	distance(pt){
		var x2_x1 = this.x - pt.x;
		var y2_y1 = this.y - pt.y;
		return Math.sqrt(x2_x1 * x2_x1 + y2_y1 * y2_y1);
	}

	angleRad(pt){
		return Math.atan2(this.y - pt.y, this.x - pt.x);
	}

	angleDeg(pt){
		return Math.atan2(this.y - pt.y, this.x - pt.x) * 180 / Math.PI;
	}

}

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

	update(x, y){
		this.x = x;
		this.y = y;
		return this;
	}

	containsPoint(x, y){
        return x >= this.x &&
			x <= this.x + this.w &&
			y >= this.y &&
			y <= this.y + this.h;
	}

	draw(ctx, colour){
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = colour;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
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
        ctx.strokeStyle = "black";
		ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 45 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
		ctx.stroke();
	}

}


class Rhombus{

	constructor(x,y){
        this.w = JIVE.settings.unitTileWidth;
        this.h = JIVE.settings.unitTileHeight;
		this.x = x + this.w/2;
		this.y = y + this.h/2;

	}

	containsPoint(pt){
		return false;
	}


    update(x, y){
        this.x = x + this.w/2;
        this.y = y + this.h;
        return this;
    }

	draw(ctx){
    	var halfW = this.w/2;
    	var halfH = this.h/2;
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + halfW, this.y + halfH/2);
        ctx.lineTo(this.x , this.y + halfH);
        ctx.lineTo(this.x - halfW, this.y + halfH/2);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.stroke();
	}
}