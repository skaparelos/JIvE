class EventEmitter{
	constructor(){
		this._events = {}
	}	


	on(eventName, callback) {
		if (typeof callback !== "function")
			console.log("The callback must be a function")

		if (!this._events[eventName]) {
			this._events[eventName] = []
		}

		this._events[eventName].push(callback);
	}

	
	emit(eventName, event){
		if (this._events[eventName] === undefined 
			|| this._events[eventName].length === 0)
			return ;

		for (var callback of this._events[eventName]) { 
			callback(event) 
		} 	
	}

}
