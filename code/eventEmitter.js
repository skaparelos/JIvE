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
		//var len = this._events[type].length
		//if (len == 0)
		//	return ;

		//for (var i = 0; i < len; i++) {
        //	this._events[type].call(this, event);
    	//}

		for (var callback of this._events[eventName]) { 
			callback(event) 
		} 
		

	}


}
