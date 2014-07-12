/* global define, window */
define([
    'jquery',
    'underscore',
    'button',
    'notes', 
    'sound',
    'keyboard'
], function($, _, View, Model, Sound, Keyboard) {
    var initialize = function() {
        var octaves = [
            Model.createOctave(3),
            Model.createOctave(4)
        ];
        
        _.each(octaves, function(octave) {
            var octaveDiv = $('<div/>', { 'class' : 'octave' });
            octave.each(function(note) {
                var button = new View.Button({ model: note });
                octaveDiv.append(button.render().$el);
            });
            octaveDiv.appendTo($('body'));
        });
        
        var keyboard = Keyboard.create(octaves);
        $(window).on('keydown', keyboard.getKeydownHandler());
        $(window).on('keyup', keyboard.getKeyupHandler());
    };
    
    return {
        initialize: initialize
    };
});