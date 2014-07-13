/* global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'data/color_list'
], function($, _, Backbone, Colors) {

    var View = {};
    
    View.Button = Backbone.View.extend({        
        initialize: function() {
            this.onCss = "on";
            this.listenTo(this.model, "change:on", this.update);
            this.onColor = Colors.randomColor();
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
                this.$el.css({"background-color" : this.onColor});
                this.$el.addClass("on");
                this.trigger("on", this.onColor);
            } else {
                this.$el.css({"background-color" : ""});
                this.$el.removeClass("on");
                this.trigger("off");
            }
        },
        
        displayNoteName: function() {
            this.$el.append(this.model.get("note") + this.model.get("octv"));
        },
        
        hideNoteName: function() {
            this.$el.html("");
        },
        
        render: function() {
            this.update();
            this.$el.addClass("button");
            return this;
        }
    });
    
    View.OctaveBoard = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, "change:octave", this.displayNoteNames);
            this.buttons = this.model.map(function(note) {
                var button = new View.Button({model: note});
                this.listenTo(button, "on", this.on);
                this.listenTo(button, "off" , this.off);
                return button;
            }, this);
            this.offShadow = this.$el.css("box-shadow");
        },
        
        on: function(color){
            this.$el.css({"box-shadow" : "0px 2px 30px 5px " + color});
        },
        
        off: function(){
            this.$el.css({"box-shadow" : this.offShadow});
        },
        
        noteNamesDisplayed: false,
        
        toggleNoteNames: function() {
            this.noteNamesDisplayed = !this.noteNamesDisplayed;
            this.displayNoteNames();
        },
        
        displayNoteNames: function() {
            if(this.noteNamesDisplayed) {
                this.hideNoteNames();
                this.showNoteNames();
            } else {
                this.hideNoteNames();
            }
        },
        
        showNoteNames: function() {
            _.each(this.buttons, function(button) {
                button.displayNoteName();
            });
        },
        
        hideNoteNames: function() {
            _.each(this.buttons, function(button) {
                button.hideNoteName();
            });
        },
        
        render: function() {
            this.$el.addClass("octave").addClass("shadow");
            _.each(this.buttons, function(button) {
                this.$el.append(button.render().$el);
            }, this);
            return this;
        }
    });
    
    return {
        Button: View.Button,
        OctaveBoard: View.OctaveBoard
    };
});