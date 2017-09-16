class Selectable {

     constructor(object)
     {

         //TODO check that object inherits from EventEmitter

         this.object = object;

         // if selected by the user
         this.selected = false;

         object.on('leftclick', function (e) {
             object.selected = object.body.containsPoint(e.clientX, e.clientY);
             if (object.selected)
                 object.select();
             else
                 object.deSelect();
         });

         object.on('multiselect', function (rect) {
             object.selected = rect.containsPoint(object.body.x, object.body.y);
             if (object.selected)
                 object.select();
             else
                 object.deSelect();
         });
     }

     isSelected()
     {
         return this.selected;
     }

     setSelected(isSelected)
     {
         this.selected = isSelected;
     }

}