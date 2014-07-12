/* global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'data/color_list'
    // 'text!../button.html'
], function($, _, Backbone, Colors) {

    var Button = Backbone.View.extend({        
        initialize: function() {
            this.onCss = "on";
            this.listenTo(this.model, "change:on", this.render);
            this.onColor = Colors.randomColor();
            this.innerDiv = $("<div/>");
        },
        
        events: {
            "mousedown" : "buttonPress",
            "mouseup"   : "buttonRelease",
            "mouseout"  : "buttonRelease",
            "touchstart": "buttonPress",
            "touchstop" : "buttonRelease",
            "touchend"  : "buttonRelease"
        },
        
        buttonPress: function(){
            this.model.play();
        },
        
        buttonRelease: function() {
            this.model.stop();
        },
        
        update: function(){
            if(this.model.get("on")) {
                this.innerDiv.css({"background-color" : this.onColor});
                this.$el.addClass("on");
            } else {
                this.innerDiv.css({"background-color" : ""});
                this.$el.removeClass("on");
            }
        },
        
        render: function() {
            this.update();
            this.$el.addClass("button");
            this.$el.html(this.innerDiv);
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