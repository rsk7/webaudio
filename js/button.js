/* global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'data/color_list'
    // 'text!../button.html'
], function($, _, Backbone, Colors) {
    
    var buttonDefaults = {
        height: 50,
        width: 50, 
        padding: 5, 
        radius: 4,
        margin: 4,
        borderColor: "#C8C8C8",
        offColor: "#FFFFFF"
    };
    
    var Button = Backbone.View.extend({
        template: _.template($("#box").html()),
        
        initialize: function() {
            $.extend(this, buttonDefaults);
            this.listenTo(this.model, "change:on", this.render);
            this.onColor = Colors.randomColor();
        },
        
        update: function(){
            if(this.model.get('on')) {
                this.color = this.onColor;
            } else {
                this.color = this.offColor;
            }
        },
        
        render: function() {
            this.update();
            this.$el.html(this.template(this));
            return this;
        }
    });
    
    var OctaveGroup = Backbone.View.extend({
        
        width: 4,
        buttonCount: 0,
        
        initialize: function(options) {
            this.buttons = options.buttons;
        },
        
        addButton: function(button){
            this.buttonCount++;
            this.options.el.append(button.render());
            if(this.buttonCount % 3 === 0) {
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