class TiledMapRenderer{

	constructor(canvas){
		this.canvas = canvas || JIVE._canvas;
	}


	clearScreen(ctx){
		ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	}


	draw(map, camera, imageLoader){

		var ctx = this.canvas.getCtx();
		this.clearScreen(ctx);

		imageLoader = imageLoader || JIVE._imageLoader;

		var cam = camera.getCamera();
		var camX = cam.x;
		var camY = cam.y;
		var camZL = cam.zoomLvl;
		var bounds = camera.getViewport(map);

		var m = map.getMap();
		var layersNo = m["layersNo"];
		var unitTileWidth = m["tilewidth"];
		var unitTileHeight = m["tileheight"];

		for (var layer = 0; layer < layersNo; layer++){

			for (var h = bounds.startRow; h < bounds.endRow; h++){

				for (var w = bounds.startCol; w < bounds.endCol; w++){

					var gidValue = m["map"][layer][h][w];

					if (gidValue != 0){

						var gid = map.getGID(gidValue);

						var coords = Utils.map2ScreenCoords(
							h, w,
							gid["w"], gid["h"], 
							camX, camY, camZL, 
							unitTileWidth, unitTileHeight
							);

						ctx.drawImage(
							imageLoader.get(gid["imagename"]), 
							gid["x"], gid["y"], 
							gid["w"], gid["h"], 
							coords.x, coords.y, 
							gid["w"], gid["h"]
							);

					}
				}
			}
		}
	}
}