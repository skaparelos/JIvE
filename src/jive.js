if (typeof JIVE === "undefined")
    var JIVE = {};

JIVE.ImageLoader = new ImageLoader();
JIVE.Canvas = new Canvas();
JIVE.Map = new TiledMap();
JIVE.Camera = new Camera();
JIVE.Renderer = new Renderer();
JIVE.InputHandler = new InputHandler();
JIVE.Selector = new Selector();

JIVE._onDocumentLoad = function () {
    JIVE.Canvas.initFullScreen();
    JIVE.Camera.init();
    JIVE.Renderer.init();
    JIVE.InputHandler.init();

    // calls the user defined init() function
    init();
};
window.onload = JIVE._onDocumentLoad;

JIVE.Spawn = function (entityName, x, y, gid) {
    return Entity._factory[entityName](x, y, gid);
};

JIVE.reqAnimFrame = function (fn) {

    // reqAnimFrame is capped to 60FPS. In order to control FPS, we call
    // the drawing function every 16 secs (period) (see the if below)
    requestAnimationFrame(function () {
        JIVE.reqAnimFrame(fn);
    });

    var now = Date.now();
    this._then = this._then || 0;
    this._deltaTime = now - this._then;

    if (this._deltaTime >= 16) {
        fn(this._deltaTime);
        this._then = now - (this._deltaTime % 16)
    }
};

JIVE.settings = {
    FRAME_RATE: 1 / 60, // fps
    DEBUG: 0, // 0 for not debug, 1 for debug
};

JIVE.Keys = {

    // arrows
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,

    // numbers
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,

    // alphabet
    Q: 81,
    W: 87,
    E: 69,
    R: 82,
    T: 84,
    Y: 89,
    U: 85,
    I: 73,
    O: 79,
    P: 80,
    A: 65,
    S: 83,
    D: 68,
    F: 70,
    G: 71,
    H: 72,
    J: 74,
    K: 75,
    L: 76,
    Z: 90,
    X: 88,
    C: 67,
    V: 86,
    B: 66,
    N: 78,
    M: 77,

    // others
    ESC: 27,
    PLUS: 187,
    MINUS: 189,
    PLUS_firefox: 61, // firefox has different codes
    MINUS_firefox: 173, // firefox has different codes

    "=": 187,
    "-": 189
};


JIVE.Mouse = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
};