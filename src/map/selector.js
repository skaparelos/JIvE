/**
 *  The selector is where the mouse points at at any given instance.
 *  i.e. which tile the user has selected. It also previews the world object
 *  the user wants to load
 */

// TODO make this extend a world object and draw it as such
class Selector{

    constructor(){
        this.clear()
    }


    setPos(tileY, tileX){
        this._tileY = tileY;
        this._tileX = tileX
    }


    getPos(){
        return {
            tileX: this._tileX,
            tileY: this._tileY
        };
    }


    setImg(img){
        this._img = img;
    }


    getImg(){
        return this._img;
    }


    isHidden(){
        return this._isHidden;
    }


    setHidden(hidden){
        this._hidden = hidden;
    }


    clear(){
        this._tileX = 0;
        this._tileY = 0;

        // set to "true" if you don't want it to be drawn
        this._isHidden = false;

        // the image of the selector
        this._img = null
    }
}