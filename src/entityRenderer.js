class EntityRenderer{

	constructor(){}


	draw(entities, camera, ctx, imageLoader){

		var cam = camera.getCamera();

		for (var ent in entities){
			var e = entities[ent].getEntity();
			if (!e.isAlive
				|| !cam.camera.containsPoint(e.screenX, e.screenY)
                || e.gid === 0)
				continue;

			var gid = JIVE.getGID(e.gid);

			// draw the shape around the entity
			if (e.isSelected)
				e.that.getShape().draw(ctx, "black");

			// draw the entity image
			ctx.drawImage(
				imageLoader.get(gid["imagename"]), 
				gid["x"], gid["y"], 
				gid["w"], gid["h"], 
				e.screenX, e.screenY, 
				gid["w"], gid["h"]
				);

			//todo
			e.that.body.draw(ctx, "red");
		}

	}
}