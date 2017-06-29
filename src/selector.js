class Selector{

    constructor(inputHandler) {

        this.ih = inputHandler;
        this.dragEvent = null;
        this.curEvent = null;
        this.isMouseDragging = false;
        var that = this;

        ih.on('mousedrag', function (e) {

            if (!that.isMouseDragging) {
                that.dragEvent = e;
                that.isMouseDragging = true;
            } else {
                that.curEvent = e;
            }

        });

        ih.on('mouseup', function (e) {
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

    getRect(){
        if (!this.isMouseDragging) return undefined;
        var w = this.curEvent.clientX - this.dragEvent.clientX;
        var h = this.curEvent.clientY - this.dragEvent.clientY;
        var x = this.curEvent.clientX;
        var y = this.curEvent.clientY;
        

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

    update(){
    }


}




Selector.selectedEntities = [];
JIVE.getSelectedItems = function (){
    return Selector.selectedEntities;
}