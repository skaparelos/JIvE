class Camera extends EventEmitter {

    constructor(x, y, scrollSpeed, zoomLvl) {

        super();

        this.body = new Rectangle(x || 0, y || 0, 0, 0);

        this.scrollingSpeed = scrollSpeed || 1;
        this.zoomLvl = zoomLvl || 1;

        // keeps a boolean of whether there was a change in
        // the position of the body.
        this.posChanged = true;

        return this;
    }

    init() {
        this.initX = Math.floor(JIVE.Canvas.getWidth() / 2);
        this.body.x = this.initX;
        this.body.w = JIVE.Canvas.getWidth();
        this.body.h = JIVE.Canvas.getHeight();
    }

    get(){
        return this;
    }

    getCamera() {

        if (JIVE.Canvas.hasChanged()) {
            this.body.w = JIVE.Canvas.getWidth();
            this.body.h = JIVE.Canvas.getHeight();
        }

        return {
            body: this.body,
            zoomLvl: this.zoomLvl
        };
    }

    containsPoint(x, y){
        return x >= this.body.x - this.initX &&
                x <= this.body.x + this.body.w &&
                y >= this.body.y &&
                y <= this.body.y + this.body.h;
    }

    /**
     * Finds the area of the map that the body sees.
     *
     */
    getViewport() {

        // If the position of the body has not changed
        // since the last call to this function
        // then return the results of the previous times
        if (!this.posChanged) {
            return {
                startRow: this._startRow,
                endRow: this._endRow,
                startCol: this._startCol,
                endCol: this._endCol
            };
        }

        var mapWidth = JIVE.settings["mapWidth"];
        var mapHeight = JIVE.settings["mapHeight"];

        this._startRow = 0;
        this._startCol = 0;
        this._endRow = mapHeight;
        this._endCol = mapWidth;

        var screenWidth = JIVE.Canvas.getWidth();
        var screenHeight = JIVE.Canvas.getHeight();
        if (this.w !== screenWidth) this.w = screenWidth;
        if (this.h !== screenHeight) this.h = screenWidth;

        var leftUp = {clientX: 0, clientY: 0};
        var rightUp = {clientX: this.w, clientY: 0};
        var leftDown = {clientX: 0, clientY: this.h};
        var rightDown = {clientX: this.w, clientY: this.h};

        var res = Utils.screen2MapCoords(leftUp, this);
        if (res !== -1) this._startCol = res.tileX;

        res = Utils.screen2MapCoords(rightUp, this);
        if (res !== -1) this._startRow = res.tileY;

        res = Utils.screen2MapCoords(leftDown, this);
        if (res !== -1) this._endRow = (res.tileY + 2 > mapHeight) ? mapHeight : res.tileY + 2;

        res = Utils.screen2MapCoords(rightDown, this);
        if (res !== -1) this._endCol = (res.tileX + 1 > mapWidth) ? mapWidth : res.tileX + 1;

        // the position now has been registered so
        // we keep returning this unless there is a
        // change from the move() function or some other
        // setter function
        this.posChanged = false;

        return {
            startRow: this._startRow,
            endRow: this._endRow,
            startCol: this._startCol,
            endCol: this._endCol
        };

    }

    /**
     *
     * @param direction - an object like {left:1, right:0, up:0, down:1}
     *        indicating the direction(s) of movement.
     *
     */
    move(direction, dt) {

        // change in x, y
        var dx = 0;
        var dy = 0;

        if (direction.left) dx = this.scrollingSpeed * dt;
        if (direction.right) dx = -this.scrollingSpeed * dt;
        if (direction.up) dy = this.scrollingSpeed * dt;
        if (direction.down) dy = -this.scrollingSpeed * dt;

        this.body.x += dx;
        this.body.y += dy;

        this.posChanged = true;

        return {dx: dx, dy: dy};
    }

    setX(x) {
        this.x = x;
        this.posChanged = true;
        return this;
    }

    setY(y) {
        this.y = y;
        this.posChanged = true;
        return this;
    }

    setW(w) {
        this.w = w;
        this.posChanged = true;
        return this;
    }

    setH(h) {
        this.h = h;
        this.posChanged = true;
        return this;
    }
}
