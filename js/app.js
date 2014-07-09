/* global define, window */
define([
    'jquery',
    'underscore',
    'button',
    'notes', 
    'sound'
], function($, _, View, Model, Sound) {
    var initialize = function() {
        
        var noteA = new Model.Note({
            note : 'A', 
            octv :	4, 
            freq : 440	 
        });
        
        var octave = Model.createOctave(2);
        var buttonA = new View.Button({ model: noteA });
        
        $('body').append(buttonA.render().$el);
        
        window.noteA = noteA;
        window.buttonB = buttonA;
        window.sound = Sound;
        window.octave = octave;
        window.createOctave = Model.createOctave;
    };
    
    return {
        initialize: initialize
    };
});