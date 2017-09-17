class GameObject extends EventEmitter {

    constructor()
    {
        super();
        this.id = GameObject.id++;
        GameObject.list.push(this);
    }
}

/* Static */
GameObject.id = 0;
GameObject.list = []