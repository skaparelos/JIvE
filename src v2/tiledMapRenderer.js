class TiledMapRenderer{

	constructor(canvas){
		this.canvas = canvas || JIVE._canvas;
	}


	clearScreen(ctx){
		ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	}


	draw(tiledMap, camera, imageLoader){

		imageLoader = imageLoader || JIVE._imageLoader;

		var ctx = this.canvas.getCtx();
		this.clearScreen(ctx);

		var cam = camera.getCamera();

		var map = tiledMap.getMap();
		var layersNo = map["layersNo"];
		var mapW = map["mapwidth"];
		var mapH = map["mapheight"];
		var unitTileWidth = map["tilewidth"];
		var unitTileHeight = map["tileheight"];

		for (var layer = 0; layer < layersNo; layer++){

			for (var h = cam.y; h < cam.y+cam.h /*mapH*/; h++){

				for (var w = cam.x; w < cam.x + cam.w /*mapW*/; w++){

					var gidValue = map["map"][layer][h][w];

					if (gidValue != 0){

						var gid = tiledMap.getGID(gidValue);

						var coords = Utils.map2ScreenCoords(h, w, gid["w"], 
							gid["h"], 300, 100, 1, unitTileWidth, unitTileHeight);

						ctx.drawImage(imageLoader.get(gid["imagename"]), 
							gid["x"], gid["y"], gid["w"], gid["h"], 
							coords.x, coords.y, 
							gid["w"], gid["h"]);

					}
				}
			}
		}
	}
}