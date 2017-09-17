class TiledMap {

    constructor() {

        // holds the base layer(s).
        // it only holds the background layers that
        // do not contain Entities like people, trees, items, etc.
        // Entities are created and maintained using the list JIVE.Entities
        this.map = [];

        // the number of background layers
        this.layersNo = 0;

        // the width of the map in number of tiles
        this.mapWidth = 0;

        // the height of the map in number of tiles
        this.mapHeight = 0;

        // indicates whether a tiled map has been loaded or not.
        this.loaded = false;

        return this;

    }

    /**
     * loadJSON takes a JSON exported from tiled and loads the map.
     * @param JsonURI string
     * @param callback function
     * @param imageLoader instance of imageLoader class
     */
    loadJSON(JsonURI, camera, callback, imageLoader) {
        imageLoader = imageLoader || JIVE.ImageLoader;
        var that = this;

        Utils.xhrGet(JsonURI, function (data) {
            that.parseMap(data.responseText, camera);
            that.loadImages(data.responseText, callback, imageLoader);
            that.loaded = true;
        })
    }


    isLoaded() {
        return this.loaded;
    }


    getMap() {
        return {
            "map": this.map,
            "layersNo": this.layersNo,
            "mapwidth": this.mapWidth,
            "mapheight": this.mapHeight
        }
    }


    setTile(layer, row, col, gidValue) {
        this.map[layer][row][col] = gidValue;
        return this;
    }


    loadImages(data, callback, imageLoader) {
        var jsonData = JSON.parse(data);
        var tilesets = jsonData["tilesets"];
        var imgsList = [];
        for (var ts = 0; ts < tilesets.length; ts++) {
            imgsList.push(tilesets[ts]["image"]);
        }

        // load the images
        imageLoader.loadImages(imgsList, callback);
    }


    parseMap(data, camera) {
        var jsonData = JSON.parse(data);
        var layers = jsonData["layers"];
        var tileSets = jsonData["tilesets"];

        this.mapWidth = jsonData["width"];
        this.mapHeight = jsonData["height"];

        JIVE.settings["unitTileWidth"] = jsonData["tilewidth"];
        JIVE.settings["unitTileHeight"] = jsonData["tileheight"];
        JIVE.settings["mapWidth"] = jsonData["width"];
        JIVE.settings["mapHeight"] = jsonData["height"];

        // create a mapping between GIDs and the position of the atlas frame
        // in the atlas image.
        // build the {"gid": [imageName, x, y, w, h]}
        var gid = 1;
        for (var tileset = 0; tileset < tileSets.length; tileset++) {

            var imageName = tileSets[tileset]["image"];
            var imageHeight = tileSets[tileset]["imageheight"];
            var heightStep = tileSets[tileset]["tileheight"];
            for (var h = 0; h < imageHeight; h += heightStep) {

                var imageWidth = tileSets[tileset]["imagewidth"];
                var widthStep = tileSets[tileset]["tilewidth"];
                for (var w = 0; w < imageWidth; w += widthStep) {

                    JIVE.gid2ImagePos[gid] = {
                        "imagename": imageName,
                        "x": w, "y": h, "w": widthStep, "h": heightStep
                    };
                    gid++;
                }
            }
        }


        // create the map as a 2d array so that it is easier to
        // manipulate it later. For each layer go through the
        // the data on that layer and create the map.
        var map2d = [], ctr = 0;
        for (var layer = 0; layer < layers.length; layer++) {

            // if the name of the layer contains the word "base" then we do not
            // create Entities out of the layer.
            var isBaseLayer = layers[layer]["name"].includes("base");
            if (isBaseLayer)
                this.layersNo++;

            for (var i = 0; i < this.mapHeight; i++) {
                if (isBaseLayer)
                    map2d[i] = [];

                for (var j = 0; j < this.mapWidth; j++) {
                    if (isBaseLayer)
                        map2d[i][j] = layers[layer]["data"][ctr];
                    else {
                        if (layers[layer]["data"][ctr] === 0) {
                            ctr++;
                            continue;
                        }
                        var tgid = layers[layer]["data"][ctr];
                        var screenCoords = Utils.map2ScreenCoords(i, j,
                            JIVE.getGID(tgid)["w"], JIVE.getGID(tgid)["h"],
                            camera
                        );

                        // check that the tgid has custom tileproperties
                        if (!(tgid - 1 in tileSets[0]["tileproperties"])) {
                            ctr++;
                            continue;
                        }
                        // get the entity name and spawn it
                        var entityType = tileSets[0]["tileproperties"][tgid - 1]["type"];
                        if (entityType)
                            JIVE.Spawn(entityType,
                                screenCoords.x,
                                screenCoords.y,
                                tgid
                            );
                    }
                    ctr++;
                }
            }

            if (isBaseLayer) {
                this.map.push(map2d);
            }
            map2d = [];
            ctr = 0;
        }
    }
}

/* @static */
if (typeof JIVE == "undefined")
    var JIVE = {};
JIVE.gid2ImagePos = {};
JIVE.getGID = function (gid) {
    return JIVE.gid2ImagePos[gid];
}