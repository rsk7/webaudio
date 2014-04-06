define([
    'jquery',
    'underscore',
    'backbone',
    'data/color_list'
    // 'text!../button.html'
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
            this.offColor = "#FFFFFF";
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
        
        initialize: function(options) {
            this.container = options.container;
            this.buttons = options.buttons;
        },
        
        addButton: function(button){
            buttonCount++;
            this.options.el.append(button.render());
            if(buttonCount % 3 === 0) {
                this.br();
            }
        },
        
        br: function() {
            this.el.append("<br/>");
        },
        
        render: function() {
            _.each(this.buttons, 
                   this.addButton,
                   this);
            this.container.append(this.el);
        }
    });
    
    return {
        Button: Button,
        OctaveGroup: OctaveGroup
    };
});