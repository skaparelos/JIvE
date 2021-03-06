class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    equal(pt) {
        return this.x === pt.x && this.y === pt.y;
    }

    sameX(pt) {
        return this.x === pt.x;
    }

    sameY(pt) {
        return this.y === pt.y;
    }

    add(pt) {
        this.x += pt.x;
        this.y += pt.y;
        return this;
    }

    subtract(pt) {
        this.x -= pt.x;
        this.y -= pt.y;
        return this;
    }

    absSubtract(pt) {
        return new Point(Math.abs(this.x - pt.x), Math.abs(this.y - pt.y));
    }

    update(dx, dy) {
        this.x = dx;
        this.y = dy;
        return this;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    distance(pt) {
        var x2_x1 = this.x - pt.x;
        var y2_y1 = this.y - pt.y;
        return Math.sqrt(x2_x1 * x2_x1 + y2_y1 * y2_y1);
    }

    angleRad(pt) {
        return Math.atan2(this.y - pt.y, this.x - pt.x);
    }

    angleDeg(pt) {
        return Math.atan2(this.y - pt.y, this.x - pt.x) * 180 / Math.PI;
    }

}

/** Abstract class */
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    update() {
    }

    setPos() {
    }

    getShape() {
    }

    containsPoint() {
    }

    overlap() {
    }

    draw() {
    }
}


class Rectangle extends Shape {

    constructor(x, y, w, h, offsetX, offsetY) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    getShape() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
    }

    update(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    setPos(x, y) {
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
    }

    containsPoint(x, y) {
        return x >= this.x &&
            x <= this.x + this.w &&
            y >= this.y &&
            y <= this.y + this.h;
    }

    overlap(rect) {
        // left_rect is the one with the smaller x
        var left_rect, right_rect;

        if (this.x === rect.x && this.y === rect.y)
            return true;

        if (this.x <= rect.x) {
            left_rect = this;
            right_rect = rect;
        } else {
            left_rect = rect;
            right_rect = this;
        }

        // check cases like +
        if (right_rect.x < left_rect.x + left_rect.w &&
            right_rect.y < left_rect.y &&
            right_rect.y + right_rect.h > left_rect.y)
            return true;

        // we now need to check four corners
        return left_rect.containsPoint(right_rect.x, right_rect.y) ||
            left_rect.containsPoint(right_rect.x + right_rect.w, right_rect.y) ||
            left_rect.containsPoint(right_rect.x, right_rect.y + right_rect.w) ||
            left_rect.containsPoint(right_rect.x + right_rect.w, right_rect.y + right_rect.w);

    }

    draw(ctx, colour) {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = colour;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
    }

}


class Circle extends Shape {

    constructor(x, y, radius, offsetX, offsetY) {
        super();
        this.x = x + offsetX;
        this.y = y + offsetY;
        this.r = radius;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setPos(x, y) {
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}


class Ellipse extends Shape {

    constructor(x, y, radiusX, radiusY, offsetX, offsetY) {
        super();
        this.x = x + offsetX;
        this.y = y + offsetY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    setPos(x, y) {
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 45 * Math.PI / 180, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.stroke();
    }

}


class Rhombus extends Shape {

    constructor(x, y) {
        super();
        this.w = JIVE.settings.unitTileWidth;
        this.h = JIVE.settings.unitTileHeight;
        this.x = x + this.w / 2;
        this.y = y + this.h / 2;

    }

    containsPoint(pt) {
        return false;
    }


    update(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    setPos(x, y) {
        this.x = x + this.w / 2;
        this.y = y + this.h;
    }

    draw(ctx) {
        var halfW = this.w / 2;
        var halfH = this.h / 2;
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + halfW, this.y + halfH / 2);
        ctx.lineTo(this.x, this.y + halfH);
        ctx.lineTo(this.x - halfW, this.y + halfH / 2);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.stroke();
    }
}