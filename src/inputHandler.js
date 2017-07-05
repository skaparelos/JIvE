class InputHandler extends EventEmitter {

    constructor() {

        super();

        // keeps the mapping between a keycode and a user defined action
        // e.g. the keycode 87 (letter W) can be mapped to a user defined
        // action like 'move-up' (it can be any name).
        // We let the user use the bind() function to register these mappings like
        // inputHandler = JIVE.InputHandler().init();
        // inputHandler.bind(87, 'move-up');
        // or
        // inputHandler.bind(JIVE.Keys.W, 'move-up');
        this.bindings = {};

        // a dictionary of actions indicating whether an action defined by the user
        // using the bind() function takes place now or not.
        // Specifically this.actions is a dictionary that maps user defined actions
        // to either true or false.
        // e.g. {'move-up':true, 'move-down':false, 'move-left':false, 'move-right':true}
        this.actions = {};

        // pre registered mouse events
        this.actions['mousedrag'] = false;
        this.actions['mousedown'] = false;
    }


    /**
     * init() is used by the user to initialise the basic event listeners.
     * This function must be called by the user explicitly.
     */
    init() {

        // Keyboard
        document.body.addEventListener('keydown', this.handleKeyDown.bind(this), false);
        document.body.addEventListener('keyup', this.handleKeyUp.bind(this), false);

        // Mouse
        document.body.addEventListener('contextmenu', function (e) {
            // disables right click
            e.preventDefault();
        }, false);
        document.body.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        document.body.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
        document.body.addEventListener('mousemove', this.handleMouseMove.bind(this), false);

        // Window
        window.addEventListener('resize', JIVE.Canvas.updateCanvasSize.bind(this));

        return this;
    }

    /**
     * Binds a keyCode to a user defined action
     * @param keyCode int
     * @param action string
     */
    bind(keyCode, action) {

        // bind the keycode to an action
        this.bindings[keyCode] = action;

        // if the action is not registered,
        // then register the action
        if (this.actions[action] === null) {
            this.actions[action] = false;
        }

        return this;
    }

    /**
     * Returns the state of an action
     * @param action string
     * @return {true, false}
     */
    getActionState(action) {
        return this.actions[action];
    }


    handleKeyUp(e) {
        var action = this.bindings[e.keyCode];
        if (action) {
            this.actions[action] = false;
        }
    }


    handleKeyDown(e) {
        var action = this.bindings[e.keyCode];
        if (action) {
            this.actions[action] = true;

            // TODO: the problem here is that the function
            // gets executed only once a key is down, then waits for some time
            // to call this again. As a result, the emit function doesn't get called
            // as often as it should to provide a smooth experience.
            // The problem is that pressing a button down is treated as a distinct event rather
            // than a continuous one. This happens only with the keyboard, mouse is fine
            // unless we want to fire when we hold the button down.
            this.emit(action, e);
        }
    }


    handleMouseMove(e) {
        if (this.actions['mousedown']) {
            this.actions['mousedrag'] = true;
            this.emit('mousedrag', e);
        }
    }


    handleMouseUp(e) {
        if (!this.actions['mousedrag']) {
            this.emit('mouseclick', e);
        }
        this.actions['mousedown'] = false;
        this.actions['mousedrag'] = false;
        this.emit('mouseup', e);

        var action = this.bindings[e.button];
        if (action) {
            this.actions[action] = false;
        }
    }


    handleMouseDown(e) {
        this.actions['mousedown'] = true;

        var action = this.bindings[e.button];
        if (action) {
            this.actions[action] = true;
            this.emit(action, e);
        }
    }

}