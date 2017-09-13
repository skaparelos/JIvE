class EntityRenderer{

	constructor(entities, camera, canvas, imageLoader)
	{
		this.entities = entities;
		this.camera = camera;
		this.canvas = canvas;
		this.imageLoader = imageLoader;
	}


	draw()
	{
		var ctx = this.canvas.getCtx();

		// z ordering based on screenY
		// the one with the smallest y should be drawn first.
		this.entities.sort(compare);

		for (var e in this.entities)
		{
			var entity = this.entities[e];
			if (!entity.isAlive ||
				!this.camera.containsPoint(entity.screenX, entity.screenY) ||
                 entity.gid === 0)
				continue;

			var gid = JIVE.getGID(entity.gid);

			// draw the shape around the entity
			if (entity.selected)
			{
                entity.getShape().draw(ctx, "black");
                if (JIVE.settings.DRAW_DEBUG)
                {
                    entity.body.draw(ctx, "red");
                }
            }

			// draw the entity image
			ctx.drawImage(
				this.imageLoader.get(gid["imagename"]),
				gid["x"], gid["y"], 
				gid["w"], gid["h"], 
				entity.screenX, entity.screenY,
				gid["w"], gid["h"]
				);

			// draw dots indicating the path
            for (var pt in entity.path)
            {
				var row = entity.path[pt].x;
				var col = entity.path[pt].y;
				var p = Utils.map2ScreenCoords(row, col, 64, 64, this.camera);
				ctx.fillRect(p.x + 32, p.y + 32, 5, 5);
            }
		}

	}
}

// used for sorting the entities
function compare(a,b)
{
    if (a.screenY < b.screenY)
        return -1;
    if (a.screenY > b.screenY)
        return 1;
    return 0;
}