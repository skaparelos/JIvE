class GameObject extends EventEmitter {

    constructor() {
        super();
        this.id = GameObject.id++;
    }
}

/* Static */
GameObject.id = 0;