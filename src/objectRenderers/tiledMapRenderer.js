class TiledMapRenderer {

    constructor(map, camera, canvas, imageLoader)
    {
        this.map = map;
        this.camera = camera;
        this.canvas = canvas;
        this.imageLoader = imageLoader;
    }

    draw()
    {
        var ctx = this.canvas.getCtx();
        var bounds = this.camera.getViewport();
        var map = this.map.getMap();
        var layersNo = map["layersNo"];

        for (var h = bounds.startRow; h < bounds.endRow; h++)
        {
            for (var w = bounds.startCol; w < bounds.endCol; w++)
            {
                for (var layer = 0; layer < layersNo; layer++)
                {

                    var gidValue = map["map"][layer][h][w];
                    if (gidValue === 0) continue;

                    var gid = this.map.getImageByGID(gidValue);
                    var coords = Utils.map2ScreenCoords(
                        h, w,
                        gid["w"], gid["h"],
                        this.camera
                    );
                    ctx.drawImage(
                        this.imageLoader.get(gid["imagename"]),
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