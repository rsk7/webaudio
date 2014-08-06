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
        var leftButtons = new View.OctaveBoard.Buttons({
            el: ".left .octave",
            model: leftOctave, 
            tiltCss: "tilt-left", 
            reverseTiltCss: "tilt-right",
            configEl: ".left .config"
        }).render();
        
        var rightOctave = Model.createOctave(5);
        var rightButtons = new View.OctaveBoard.Buttons({
            el: ".right .octave",
            model: rightOctave, 
            tiltCss: "tilt-right", 
            reverseTiltCss: "tilt-left",
            configEl: ".right .config"
        }).render();
        
        // for toggling note names on keys 
        var octaveBoards = [leftButtons, rightButtons];
        window.toggleNoteNames = function() {
            _.each(octaveBoards, function(board) {
                board.noteNameDisplay.toggleNoteNames();
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