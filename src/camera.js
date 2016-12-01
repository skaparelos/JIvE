// Represents the viewport
class Camera{

	constructor(width, height){
		
		// Set the viewport to the origin	
		this._x = 0;
		this._y = 0;
		this._width = 0;
		this._height = 0;
        this.updateCameraSize(width, height);

		this._scrollingSpeed = g_camera_settings["scrollingSpeed"];
		this._zoomLevel = g_camera_settings["initialZoomLevel"];
		this._allowChangeInZoom = g_camera_settings["allowChangeInZoomLevel"];

		this._upButtons    = g_camera_settings["UP"];
		this._downButtons  = g_camera_settings["DOWN"];
		this._leftButtons  = g_camera_settings["LEFT"];
		this._rightButtons = g_camera_settings["RIGHT"];
	}


	updateCameraSize(width, height){
		this._width = width;
		this._height = height;
		this._setCustomCornerScreenEvents(width, height);
	}


    /**
     *
     *  Four events that are used to identify the bounds of the visible map
     *  portion to the user
     *
     *  Imagine this is the screen:
     *
     *  E-----------E
     *  |           |
     *  |           |
     *  |           |
     *  E-----------E
     */
    _setCustomCornerScreenEvents(width, height){
        this._eventLeftUp = {clientX : 0, clientY : 0};
        this._eventRightUp = {clientX : width, clientY : 0};
        this._eventLeftDown = {clientX : 0, clientY : height};
        this._eventRightDown = {clientX : width, clientY : height};
    }


    /**
     *  This function finds which parts of the map are shown to the player
     *  and returns them. i.e. which portion of the map the user sees.
     *
     *  It does so by calculating the 4 edges of the screen and finding the
     *  their corresponding map cells.
     *
     *  e.g. screen with four Edges (E)
     *  E-----------E
     *  |           |
     *  |           |
     *  |           |
     *  E-----------E
     *
     *  imagine that the map is bigger than the screen
     *  so that the screen only shows a portion of the map.
     */
    identifyVisibleMapBounds(map){

		/*
		 Check the 4 edges of the screen to see which tiles are there.
		 Then draw the tiles that can appear on the screen and nothing more

		 This is a big reduction:
		 in a 200x200 map we drop from 40.000 iterations to about 1000.
		 */

		var mapSize = map.getSize();
        var mapW = mapSize.width;
        var mapH = mapSize.height;

        var startRow = 0;
        var startCol = 0;
        var endRow = mapH;
        var endCol = mapW;

        var res = map.screen2MapCoords(this._eventLeftUp, this);
        if (res != -1) {
            startCol = res.tileX;
        }

        res = map.screen2MapCoords(this._eventRightUp, this);
        if (res != -1) {
            startRow = res.tileY;
        }

        res = map.screen2MapCoords(this._eventLeftDown, this);
        if (res != -1) {
            endRow = (res.tileY + 2 > mapH) ? mapH : res.tileY + 2;
        }

        res = map.screen2MapCoords(this._eventRightDown, this);
        if (res != -1) {
            endCol = (res.tileX + 1 > mapW) ? mapW : res.tileX + 1;
        }

        return {
            startRow:  startRow,
            endRow: endRow,
            startCol: startCol,
            endCol: endCol
        };
    }


	_checkButtonPressed(keyAction, buttons){
		for (var key in buttons){
			var value = buttons[key];
			if (keyAction[value] === true)
				return true;
		}
		return false
	}


	/**
	 *  Moves the camera
	 */
	move(keyAction, dt){
		var keys = Utils.keyboardKeys;

		var UP    = this._checkButtonPressed(keyAction, this._upButtons);
		var DOWN  = this._checkButtonPressed(keyAction, this._downButtons);
		var LEFT  = this._checkButtonPressed(keyAction, this._leftButtons);
		var RIGHT = this._checkButtonPressed(keyAction, this._rightButtons);

		if (DOWN || UP || LEFT || RIGHT){
    
			var dx = 0;
			var dy = 0;
			  
			if (UP)    dy =  this._scrollingSpeed * dt;
			if (DOWN)  dy = -this._scrollingSpeed * dt;
			if (LEFT)  dx =  this._scrollingSpeed * dt;
			if (RIGHT) dx = -this._scrollingSpeed * dt;

			// update the position of the viewport 
			this._x += dx;
			this._y += dy;

		}
		return this;
	}


	getCamera(){
		return{
			x: this._x,
			y: this._y,
			width: this._width,
			height: this._height,
			zoomLevel: this._zoomLevel
		};
	}


	getPos(){
		return {
			x: this._x,
			y: this._y
		};
	}


	getZoomLevel(){
		return this._zoomLevel
	}


    _isZoomChangeAllowed(){
        if(this._allowChangeInZoom){
            return true;
        }else{
            console.log("changing the zoom level is not allowed. Check the configuration file");
            return false;
        }
    }


	increaseZoomLevel(){
		if (this._isZoomChangeAllowed()) {
            if (this._zoomLevel > 1)
                this._zoomLevel -= 1;
        }
		return this
	}


	decreaseZoomLevel(){
		if (this._isZoomChangeAllowed())
			this._zoomLevel +=1;
		return this
	}


	setZoomLevel(value){
		if (this._isZoomChangeAllowed())
			this._zoomLevel = value;
		return this
	}

}
