/* global define, window */
define([
    'jquery',
    'underscore',
    'backbone',
    'data/color_list'
], function($, _, Backbone, Colors) {







    var View = {};
    
    // This is for a single button
    View.Button = Backbone.View.extend({        
        initialize: function() {
            this.onCss = "on";
            this.listenTo(this.model, "change:on", this.update);
            this.onColor = Colors.randomColor();
        },
        
        events: {
            "mousedown" : "buttonPress",
            "touchstart": "buttonPress",
            "mouseup"   : "buttonRelease",
            "mouseout"  : "buttonRelease",
            "touchstop" : "buttonRelease",
            "touchend"  : "buttonRelease"
        },
        
        buttonPress: function(){
            this.model.play();
        },
        
        buttonRelease: function() {
            this.model.stop();
        },
        
        // add css for on/off events
        // trigger on event on itself
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
        
        // Add note names to html
        displayNoteName: function() {
            this.$el.html(this.model.get("note") + this.model.get("octv"));
        },
        
        // Remove note names from html
        hideNoteName: function() {
            this.$el.html("");
        },
        
        // calls update
        render: function() {
            this.update();
            this.$el.addClass("button");
            return this;
        }
    });
    
    // This is for 12 buttons
    View.OctaveBoard = {};
    
    // The only thing that can be changed in waveType for now
    View.OctaveBoard.Config = Backbone.View.extend({
        template: _.template($("#config-template").html()),

        events : { 
            "change .wave-type-setter select" : "waveTypeChange",
            "click .wave-table-setter input[type='button']" : "waveTableChange"
        },

        waveTypeChange: function() {
            this.model.setWaveType(this.$el.find("select").val());
            this.$el.find("select").blur();
        },

        waveTableChange: function() {
            var url = this.$el.find(".wave-table-setter input[text]").val();
            var table = this.$el.find(".wave-table-setter textarea").val();

            if (table.length > 0) {
                table = table.replace(/'/g, "\"");
                table = JSON.parse(table);
                this.model.setWaveTable(table);
            } else if (url.length > 0) {
                $.ajax({
                    url: url,
                    dataType: "jsonp"
                }).done(function(data) {
                    this.model.setWaveTable(data);
                });
            }

        },

        render: function() {
            this.$el.html(this.template({}));
        }
    });
    
    View.OctaveBoard.Buttons = Backbone.View.extend({
        initialize: function(options) {
            this.buttons = this.model.map(function(note) {
                return new View.Button({model:note});
            });
            this.setupFeatures(options);
        },
        
        // initializes objects for adding visual (css/html) effects to this view
        setupFeatures: function(options) {
            this.shadow = new View.OctaveBoard.Shadow(this);
            this.octaveShiftTilt = new View.OctaveBoard.OctaveShiftTilt(this, options);
            this.noteNameDisplay = new View.OctaveBoard.NoteNameDisplay(this);
            this.config = new View.OctaveBoard.Config({
                model: this.model, 
                el: options.configEl
            });
        },
        
        render: function() {
            _.each(this.buttons, function(button) {
                this.$el.append(button.render().$el);
            }, this);
            this.config.render();
            return this;
        }
    });
        
    View.OctaveBoard.Shadow = function(buttonsView) {
        this.buttonsView = buttonsView;
        this.offShadow = buttonsView.$el.css("box-shadow");
        _.each(buttonsView.buttons, function(button) {
            this.listenTo(button, "on", this.on);
            this.listenTo(button, "off", this.off);
        }, this);
    };
    
    _.extend(View.OctaveBoard.Shadow.prototype, Backbone.Events);
    
    View.OctaveBoard.Shadow.prototype.on = function(color) {
        this.buttonsView.$el.css({"box-shadow" : "0px 2px 30px 5px " + color});
    };
    
    View.OctaveBoard.Shadow.prototype.off = function() {
        this.buttonsView.$el.css({"box-shadow" : this.offShadow});
    };
    
    View.OctaveBoard.OctaveShiftTilt = function(buttonsView, options) {
        this.buttonsView = buttonsView;
        this.tiltCss = options.tiltCss;
        this.reverseTiltCss = options.reverseTiltCss;
        this.listenTo(buttonsView.model, "change:octave", this.updateOctaveChange);
    };
    
    _.extend(View.OctaveBoard.OctaveShiftTilt.prototype, Backbone.Events);
    
    View.OctaveBoard.OctaveShiftTilt.prototype.updateOctaveChange = function(updateDirection) {
        var tiltCss = updateDirection === "up" ? this.tiltCss : this.reverseTiltCss;
        this.buttonsView.$el.addClass(tiltCss);
        window.setTimeout(_.bind(function() {
            this.buttonsView.$el.removeClass(tiltCss);
        }, this), 200);
    };
    
    View.OctaveBoard.NoteNameDisplay = function(buttonsView) {
        this.buttonsView = buttonsView;
        this.noteNamesDisplayed = false;
        this.listenTo(buttonsView.model, "change:octave", this.displayNoteNames);
    };
    
    _.extend(View.OctaveBoard.NoteNameDisplay.prototype, Backbone.Events);
    
    View.OctaveBoard.NoteNameDisplay.prototype.displayNoteNames = function() {
        if(this.noteNamesDisplayed) {
            this.showNoteNames();
        } else {
            this.hideNoteNames();
        }
    };
    
    View.OctaveBoard.NoteNameDisplay.prototype.toggleNoteNames = function() {
        this.noteNamesDisplayed = !this.noteNamesDisplayed;
        this.displayNoteNames();
    };
    
    View.OctaveBoard.NoteNameDisplay.prototype.showNoteNames = function() {
        _.each(this.buttonsView.buttons, function(button) {
            button.displayNoteName();
        });
    };
    
    View.OctaveBoard.NoteNameDisplay.prototype.hideNoteNames = function() {
        _.each(this.buttonsView.buttons, function(button) {
            button.hideNoteName();
        });
    };
    
    return {
        Button: View.Button,
        OctaveBoard: View.OctaveBoard
    };
});
