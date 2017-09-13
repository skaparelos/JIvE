class SelectorRenderer{

    constructor(selector, canvas) {
        this.selector = selector;
        this.canvas = canvas;
    }

    draw() {
        if(!this.selector.isActive()) return;
        var rect = this.selector.getSelectedRect();
        if (!rect) return;
        rect.draw(this.canvas.getCtx(), "black");
    }
}

