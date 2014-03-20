// Filename: app.js
define([
    'jquery',
    'underscore',
    'button',
    'notes'
], function($, _, View, Model) {
    var initialize = function() {
        var leftOctave = new Model.Octave({octave: 2});
        var rightOctave = new Model.Octave({octave: 3});
        
        var leftButtons = new View.OctaveGroup({
            model: leftOctave,
            container: $("body")
        });
        
        var rightButtons = new View.OctaveGroup({
            model: rightOctave,
            container: $("body")
        });
        
        leftButtons.render();
        rightButtons.render();
    };
    
    return {
        initialize: initialize
    };
});