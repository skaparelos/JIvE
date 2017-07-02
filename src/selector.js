class Selector extends EventEmitter{

    constructor() {

        super();

        this.dragEvent = null;
        this.curEvent = null;
        this.isMouseDragging = false;
        this.clickEvent = null;
        var that = this;

        this.on('mousedrag', function (e) {
            if (!that.isMouseDragging) {
                that.dragEvent = e;
                that.isMouseDragging = true;
            } else {
                that.curEvent = e;
            }
            that.clickEvent = null;
        });

        this.on('mouseup', function (e) {
            if (that.isMouseDragging) {
                that.dragEvent = null;
                that.curEvent = null;
                that.isMouseDragging = false;
                that.clickEvent = null;
            }
        });

        this.on('mouseclick', function (e) {
            that.clickEvent = e;
            that.isMouseDragging = false;
        });
    }

    isActive(){
        return this.isMouseDragging || this.clickEvent !== null;
    }

    getSelectedRect(){
        if(!this.isActive())
            return undefined;

        // in case that there is a click event return that point
        if(this.clickEvent !== null && !this.isMouseDragging) {
            return {
                x: this.clickEvent.clientX,
                y: this.clickEvent.clientY,
                w: 0,
                h: 0
            };
        }

        if (this.curEvent === null || this.dragEvent === null)
            return undefined;

        // in case of mouse drag calculate the area of dragging
        var x, y, w, h;

        if (this.curEvent.clientX > this.dragEvent.clientX
            && this.curEvent.clientY > this.dragEvent.clientY) {
            x = this.dragEvent.clientX;
            y = this.dragEvent.clientY;
            w = this.curEvent.clientX - this.dragEvent.clientX;
            h = this.curEvent.clientY - this.dragEvent.clientY;
        }
        if(this.curEvent.clientX > this.dragEvent.clientX
            && this.curEvent.clientY < this.dragEvent.clientY){
            x = this.dragEvent.clientX;
            y = this.curEvent.clientY;
            w = this.curEvent.clientX - this.dragEvent.clientX;
            h = this.dragEvent.clientY - this.curEvent.clientY;
        }
        if(this.curEvent.clientX < this.dragEvent.clientX
            && this.curEvent.clientY < this.dragEvent.clientY) {
            x = this.curEvent.clientX;
            y = this.curEvent.clientY;
            w = this.dragEvent.clientX - this.curEvent.clientX;
            h = this.dragEvent.clientY - this.curEvent.clientY;
        }
        if(this.curEvent.clientX < this.dragEvent.clientX
            && this.curEvent.clientY > this.dragEvent.clientY) {
            x = this.curEvent.clientX;
            y = this.dragEvent.clientY;
            w = this.dragEvent.clientX - this.curEvent.clientX;
            h = this.curEvent.clientY - this.dragEvent.clientY;
        }

        return {
            x: x,
            y: y,
            w: w,
            h: h
        };
    }

}

/* @static */
Selector.selectedEntities = [];
Selector.getSelectedItems = function (){
    return Selector.selectedEntities;
}