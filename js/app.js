/* global define, window */
define([
    'jquery',
    'underscore',
    'button',
    'notes',
    'keyboard'
], function($, _, View, Model, Keyboard) {
    var initialize = function() {
        var leftOctave = Model.createOctave(3);
        var rightOctave = Model.createOctave(4);
        
        var octaves = [leftOctave, rightOctave];
        
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
        
        window.shiftLeftUp = _.bind(leftOctave.switchOctaveUp, leftOctave);
        window.shiftLeftDown = _.bind(leftOctave.switchOctaveDown, leftOctave);
        window.shiftRightUp = _.bind(rightOctave.switchOctaveUp, rightOctave);
        window.shiftRightDown = _.bind(rightOctave.switchOctaveDown, rightOctave);
        
        var keyboard = Keyboard.create(octaves);
        
        var notePressHandler = keyboard.getKeydownHandler();
        var noteReleaseHandler = keyboard.getKeyupHandler();
        var toggleNoteNameHandler = keyboard.getToggleNoteNameHandler(window.toggleNoteNames);
        var octaveSwitchHandler = keyboard.getOctaveSwitchHandler({
            leftShiftUp : window.shiftLeftUp,
            leftShiftDown: window.shiftLeftDown,
            rightShiftUp : window.shiftRightUp,
            rightShiftDown: window.shiftRightDown
        });
        
        $(window).on('keydown',  notePressHandler);
        $(window).on('keyup',    noteReleaseHandler);
        $(window).on('keydown', toggleNoteNameHandler);
        $(window).on('keydown', octaveSwitchHandler);
    };
    
    return {
        initialize: initialize
    };
});