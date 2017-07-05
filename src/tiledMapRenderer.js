class TiledMapRenderer {

    constructor() {
    }

    draw(map, camera, ctx, imageLoader) {

        var bounds = camera.getViewport();
        var m = map.getMap();
        var layersNo = m["layersNo"];

        for (var h = bounds.startRow; h < bounds.endRow; h++) {
            for (var w = bounds.startCol; w < bounds.endCol; w++) {
                for (var layer = 0; layer < layersNo; layer++) {

                    var gidValue = m["map"][layer][h][w];
                    if (gidValue === 0) continue;

                    var gid = JIVE.getGID(gidValue);
                    var coords = Utils.map2ScreenCoords(
                        h, w,
                        gid["w"], gid["h"],
                        camera
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