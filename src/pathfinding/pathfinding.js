class Pathfinding {

    constructor() {
    }

    /**
     *
     * @param map
     * @param entities
     */
    static buildPassableGrid(entities, mapW, mapH) {

        var passableGrid = [];
        for (var i = 0; i < mapH; i++) {
            passableGrid[i] = [];
            for (var j = 0; j < mapW; j++) {
                passableGrid[i][j] = 1; // empty
            }
        }

        for (var e in entities) {
            var entPos = entities[e].getTilePos();
            if (entPos === -1) continue;
            passableGrid[entPos.tileY][entPos.tileX] = 0; //occupied
        }

        return passableGrid;
    }

    /**
     *
     * @param passableGrid - the output of buildPassableGrid
     * @param startPoint
     * @param endPoint
     */
    static findPath(startPoint, endPoint, mapW, mapH) {
        var passableGrid = Pathfinding.buildPassableGrid(JIVE.Entities, mapW, mapH);
        var graph = new Graph(passableGrid, {diagonal: true});
        var start = graph.grid[startPoint.y][startPoint.x];
        var end = graph.grid[endPoint.y][endPoint.x];
        return astar.search(graph, start, end);
    }
}