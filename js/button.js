define([
    'jquery',
    'underscore',
    'backbone',
    'color_list'
], function($, _, Backbone, Colors) {
    
    var Button = Backbone.View.extend({
        template: _.template($("#box").html()),
        height: 50,
        width: 50,
        padding: 5,
        radius: 4,
        margin: 4,
        borderColor: "#C8C8C8",
        
        initialize: function(options) {
            this.container = options.container;
            this.listenTo(this.model, "change:ison", this.render);
            this.onColor = Colors.randomColor();
            this.offColor = #FFFFFF;
        },
        
        update: function(){
            if(this.model.ison) {
                this.color = this.onColor;
            } else {
                this.color = this.offColor;
            }
        },
        
        render: function() {
            this.update();
            this.container.append(
                this.template(this));
        }
    });
    
    var OctaveGroup = Backbone.View.extend({
        
        width: 4,
        buttonCount: 0,
        
        addButton: function(button){
            buttonCount++;
            this.options.el.append(button.render());
            if(buttonCount % 3 === 0) {
                this.break();
            }
        },
        
        breaK: function() {
            this.el.append("<br/>");
        },
        
        render: function() {
            this.options.container.append(this.el);
            _.each(this.options.buttons, 
                   this.addButton, 
                   this);
        }
    });
    
    return {
        Button: Button,
        OctaveGroup: OctaveGroup
    };
});