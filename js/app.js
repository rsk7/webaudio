/* global define, window */
define([
    'jquery',
    'underscore',
    'button',
    'notes',
    'keyboard'
], function($, _, View, Model, Keyboard) {
    var initialize = function() {
        
        // create models and views
        var leftOctave = Model.createOctave(4);
        var leftOctaveBoard = new View.OctaveBoard({
            model: leftOctave, 
            tiltCss: "tilt-left", 
            reverseTiltCss: "tilt-right",
            customCss: "left"
        });
        
        var rightOctave = Model.createOctave(5);
        var rightOctaveBoard = new View.OctaveBoard({
            model: rightOctave, 
            tiltCss: "tilt-right", 
            reverseTiltCss: "tilt-left",
            customCss: "right"
        });
        
        // add views to body
        $('body').append(leftOctaveBoard.render().$el);
        $('body').append(rightOctaveBoard.render().$el);
        
        // for toggling note names on keys 
        var octaveBoards = [leftOctaveBoard, rightOctaveBoard];
        window.toggleNoteNames = function() {
            _.each(octaveBoards, function(board) {
                board.toggleNoteNames();
            });
        };
        
        // keyboard for handling keypress events
        var keyboard = Keyboard.create(leftOctave, rightOctave);
        
        var notePressHandler = keyboard.getKeydownHandler();
        var noteReleaseHandler = keyboard.getKeyupHandler();
        var toggleNoteNameHandler = keyboard.getToggleNoteNameHandler(window.toggleNoteNames);
        var octaveSwitchHandler = keyboard.getOctaveSwitchHandler();
        
        $(window).on('keydown', notePressHandler);
        $(window).on('keyup',   noteReleaseHandler);
        $(window).on('keydown', toggleNoteNameHandler);
        $(window).on('keydown', octaveSwitchHandler);
        
        $("h4").on("click", window.toggleNoteNames);
    };
    
    return {
        initialize: initialize
    };
});