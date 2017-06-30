class SelectorRenderer{

    constructor(){}

    draw(selector, ctx){
        if(!selector.isActive()) return;
        var rect = selector.getSelectedRect();
        ctx.beginPath();
        ctx.lineWidth="3";
        ctx.strokeStyle="black";
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.stroke();
    }
}
