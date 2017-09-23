class Selector extends EventEmitter {

    constructor() {

        super();

        this.dragEventOrigin = null;
        this.dragEventCurrently = null;
        this.isMouseDragging = false;
        this.clickEvent = null;
        var that = this;

        this.on('mousedrag', function (e) {
            if (!that.isMouseDragging) {
                that.dragEventOrigin = e;
                that.isMouseDragging = true;
            } else {
                that.dragEventCurrently = e;
            }
            that.clickEvent = null;
        });

        this.on('mouseup', function (e) {
            if (that.isMouseDragging) {
                that.dragEventOrigin = null;
                that.dragEventCurrently = null;
                that.isMouseDragging = false;
                that.clickEvent = null;
            }
        });

        this.on('mouseclick', function (e) {
            that.clickEvent = e;
            that.isMouseDragging = false;
        });
    }


    isActive() {
        return this.isMouseDragging || this.clickEvent !== null;
    }


    getSelectedRect() {
        if (!this.isActive())
            return undefined;

        // in case that there is a click event return that point
        if (this.clickEvent !== null && !this.isMouseDragging) {
            return new Rectangle(this.clickEvent.clientX,
                this.clickEvent.clientY, 0, 0);
        }

        if (this.dragEventCurrently === null || this.dragEventOrigin === null)
            return undefined;

        // in case of mouse drag calculate the area of dragging
        var x, y, w, h;

        if (this.dragEventCurrently.clientX > this.dragEventOrigin.clientX
            && this.dragEventCurrently.clientY > this.dragEventOrigin.clientY) {
            x = this.dragEventOrigin.clientX;
            y = this.dragEventOrigin.clientY;
            w = this.dragEventCurrently.clientX - this.dragEventOrigin.clientX;
            h = this.dragEventCurrently.clientY - this.dragEventOrigin.clientY;
        }
        if (this.dragEventCurrently.clientX > this.dragEventOrigin.clientX
            && this.dragEventCurrently.clientY < this.dragEventOrigin.clientY) {
            x = this.dragEventOrigin.clientX;
            y = this.dragEventCurrently.clientY;
            w = this.dragEventCurrently.clientX - this.dragEventOrigin.clientX;
            h = this.dragEventOrigin.clientY - this.dragEventCurrently.clientY;
        }
        if (this.dragEventCurrently.clientX < this.dragEventOrigin.clientX
            && this.dragEventCurrently.clientY < this.dragEventOrigin.clientY) {
            x = this.dragEventCurrently.clientX;
            y = this.dragEventCurrently.clientY;
            w = this.dragEventOrigin.clientX - this.dragEventCurrently.clientX;
            h = this.dragEventOrigin.clientY - this.dragEventCurrently.clientY;
        }
        if (this.dragEventCurrently.clientX < this.dragEventOrigin.clientX
            && this.dragEventCurrently.clientY > this.dragEventOrigin.clientY) {
            x = this.dragEventCurrently.clientX;
            y = this.dragEventOrigin.clientY;
            w = this.dragEventOrigin.clientX - this.dragEventCurrently.clientX;
            h = this.dragEventCurrently.clientY - this.dragEventOrigin.clientY;
        }

        var rect = new Rectangle(x, y, w, h);
        this.emit('multiselect', rect);
        return rect;
    }

}

// if it is not in the list with the selected items add it
Selector.addSelected = function (item) {
    if (Selector.selectedEntities.indexOf(item) === -1)
        Selector.selectedEntities.push(item);
}

Selector.removeDeselected = function (item) {
    var index = Selector.selectedEntities.indexOf(item);
    if (index > -1)
        Selector.selectedEntities.splice(index, 1);
}


/* @static */
Selector.selectedEntities = [];
Selector.getSelectedItems = function () {
    return Selector.selectedEntities;
}