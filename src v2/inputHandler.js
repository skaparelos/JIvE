class InputHandler extends EventEmitter{

	constructor(){

		super();

		this.bindings = {};

		// a dictionary of actions indicating whether this
		// action takes place now or not
		this.actions = {};

	}

	init(){

		// Keyboard
		document.body.addEventListener('keydown', this.handleKeyDown.bind(this), false) 
		document.body.addEventListener('keyup', this.handleKeyUp.bind(this), false)

		return this;
	}

	bind(keyCode, action){

		// bind the keycode to an action
		this.bindings[keyCode] = action;

		// if the action is not registered,
		// then register the action
		if (this.actions[action] == null){
			this.actions[action] = false;
		}

		return this;
	}

	handleKeyUp(e){
		var action = this.bindings[e.keyCode];
		if (action)
			this.actions[action] = false;
	}

	handleKeyDown(e){
		var action = this.bindings[e.keyCode];
		if (action){
			this.actions[action] = true;
			this.emit(action, e);
		}
	}

	getActionState(action){
		return this.actions[action];
	}

}