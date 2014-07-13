/* global define, window */
define([
    'jquery',
    'underscore',
    'button',
    'notes',
    'keyboard'
], function($, _, View, Model, Keyboard) {
    var initialize = function() {
        var octaves = [
            Model.createOctave(3),
            Model.createOctave(4)
        ];
        
        var octaveBoards = _.map(octaves, function(octave) {
            return new View.OctaveBoard({model: octave});
        });
        
        _.each(octaveBoards, function(board) {
            $('body').append(board.render().$el);
        });
                
        window.toggleNoteNames = function() {
            _.each(octaveBoards, function(board) {
                board.toggleNoteNames();
            });
        };
        
        var keyboard = Keyboard.create(octaves);
        
        var notePressHandler = keyboard.getKeydownHandler();
        var noteReleaseHandler = keyboard.getKeyupHandler();
        var toggleNoteNameHandler = keyboard.getToggleNoteNameHandler(window.toggleNoteNames);
        var octaveSwitchHandler = keyboard.getOctaveSwitchHandler();
        
        $(window).on('keydown',  notePressHandler);
        $(window).on('keyup',    noteReleaseHandler);
        $(window).on('keydown', toggleNoteNameHandler);
        $(window).on('keydown', octaveSwitchHandler);
    };
    
    return {
        initialize: initialize
    };
});