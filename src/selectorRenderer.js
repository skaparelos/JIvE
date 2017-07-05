class SelectorRenderer{

    constructor(){}

    draw(selector, ctx){
        if(!selector.isActive()) return;
        var rect = selector.getSelectedRect();
        if (!rect) return;
        rect.draw(ctx, "black");
    }
}

