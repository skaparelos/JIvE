class Selector{

    constructor(inputHandler) {

        this.ih = inputHandler;
        this.dragEvent = null;
        this.curEvent = null;
        this.isMouseDragging = false;
        var that = this;

        this.ih.on('mousedrag', function (e) {
            if (!that.isMouseDragging) {
                that.dragEvent = e;
                that.isMouseDragging = true;
            } else {
                that.curEvent = e;
            }
        });

        this.ih.on('mouseup', function (e) {
            if (that.isMouseDragging) {
                that.dragEvent = null;
                that.curEvent = null;
                that.isMouseDragging = false;
            }
        });
    }

    isActive(){
        return this.isMouseDragging;
    }

    getSelectedRect(){
        if (!this.isMouseDragging) return undefined;
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