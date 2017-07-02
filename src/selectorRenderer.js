class SelectorRenderer{

    constructor(){}

    draw(selector, ctx){
        if(!selector.isActive()) return;
        var rect = selector.getSelectedRect();
        if (!rect) return;
        ctx.beginPath();
        ctx.lineWidth="1";
        ctx.strokeStyle="black";
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.stroke();
    }
}

