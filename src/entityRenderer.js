class EntityRenderer{

	constructor(){}


	draw(entities, camera, ctx, imageLoader){

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
		}

	}
}