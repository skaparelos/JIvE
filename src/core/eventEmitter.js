class EventEmitter {

    constructor() {
    }


    on(eventName, callback) {
        if (typeof callback !== "function") {
            console.log("The " + eventName.toString() + " callback must be a function");
            return;
        }

        if (!EventEmitter.events[eventName]) {
            EventEmitter.events[eventName] = [];
        }

        EventEmitter.events[eventName].push(callback);
    }


    emit(eventName, event) {
        if (EventEmitter.events[eventName] === undefined ||
            EventEmitter.events[eventName].length === 0)
            return;

        for (var callback of EventEmitter.events[eventName]) {
            callback(event);
        }
    }

}

/* @static */
EventEmitter.events = {};
