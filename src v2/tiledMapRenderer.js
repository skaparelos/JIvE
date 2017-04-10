class TiledMapRenderer{

	constructor(tiledMap){
		this.tiledMap = tiledMap;
	}


	clearScreen(ctx){
		ctx.clearRect(0, 0, 800, 800);
	}


	draw(imageLoader, ctx){
		this.clearScreen(ctx);

		var map = this.tiledMap.getMap();
		var layersNo = map["layersNo"];
		var mapW = map["mapwidth"];
		var mapH = map["mapheight"];
		var unitTileWidth = this.tiledMap.getTileWidth();
		var unitTileHeight = this.tiledMap.getTileHeight();

		for (var layer = 0; layer < layersNo; layer++){
			for (var h = 0; h < mapH; h++){
				for (var w = 0; w < mapW; w++){
					var gidValue = map["map"][layer][h][w];
					if (gidValue != 0){
						var gid = this.tiledMap.getGID(gidValue);
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