class EntityRenderer{

	constructor(){}


	draw(entities, camera, map, ctx, imageLoader){

		var cam = camera.getCamera();
		var camX = cam.x;
		var camY = cam.y;
		var camW = cam.w;
		var camH = cam.h;
		var camZL = cam.zoomLvl;

		for (var ent in entities){
			var e = entities[ent].getEntity();
			if (!e.isAlive) break;
			if (e.screenX < camX || e.screenX > camX + camW || e.screenY < camY || e.screenY > camY + camH ) break;
			if (e.gid == 0) break;

			var gid = JIVE.getGID(e.gid);

			// draw the shape around the entity
			if (e.isSelected)
				e.that.getShape().draw(ctx);

			// draw the entity image
			ctx.drawImage(
				imageLoader.get(gid["imagename"]), 
				gid["x"], gid["y"], 
				gid["w"], gid["h"], 
				e.screenX, e.screenY, 
				gid["w"], gid["h"]
				);
		}

	}
}