class EntityRenderer{

	constructor(){}


	draw(entities, camera, ctx, imageLoader){

		// z ordering based on screenY
		// the one with the smallest y should be drawn first.
		entities.sort(compare);

		for (var e in entities){
			var entity = entities[e];
			if (!entity.isAlive ||
				!camera.containsPoint(entity.screenX, entity.screenY) ||
                 entity.gid === 0)
				continue;

			var gid = JIVE.getGID(entity.gid);

			// draw the shape around the entity
			if (entity.selected)
				entity.getShape().draw(ctx, "black");

			// draw the entity image
			ctx.drawImage(
				imageLoader.get(gid["imagename"]), 
				gid["x"], gid["y"], 
				gid["w"], gid["h"], 
				entity.screenX, entity.screenY,
				gid["w"], gid["h"]
				);

			//todo
			entity.body.draw(ctx, "red");

			// draw dots indicating the path
            for (var pt in entity.path){
				var row = entity.path[pt].x;
				var col = entity.path[pt].y;
				var p = Utils.map2ScreenCoords(row, col, 64, 64, camera);
				ctx.fillRect(p.x + 32, p.y + 32, 5, 5);
            }
		}

	}
}


function compare(a,b) {
    if (a.screenY < b.screenY)
        return -1;
    if (a.screenY > b.screenY)
        return 1;
    return 0;
}