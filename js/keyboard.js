/* global define */
define([
    'jquery',
    'underscore',
    'data/key_codes',
    'data/note_char_binding'
], function($, _, KeyCodeData, NoteCharBindingData){

    // This controls what octave note (model) to modify based on what
    // key was pressed
    var OctaveBoard = function(octave, binding) {
        this.octave = octave;
        this.binding = binding;
    };
    
    // This is supporting _keydownHandler and _keyupHandler
    OctaveBoard.prototype._keyToActionResolver = function(key, actionName) {
        var noteChar = _.findWhere(this.binding, {character: key});
        if(noteChar !== undefined) {
            var note = this.octave.findWhere({note: noteChar.note});
            if(note !== undefined) {
                note[actionName]();
            }
        }
    };

    OctaveBoard.prototype._keydownHandler = function(event) {
        this._keyToActionResolver(KeyCodeData.KeyNumberName[event.which], 'play');
    };

    OctaveBoard.prototype._keyupHandler = function(event) {
        this._keyToActionResolver(KeyCodeData.KeyNumberName[event.which], 'stop');
    };
    
    // Takes the left and right collection models and calls and play() and stop()
    // on the right note models based on which keys are pressed
    // Depends on data from note_char_binding
    var Keyboard = function(leftOctave, rightOctave) {
        this.leftOctaveBoard = new OctaveBoard(leftOctave, NoteCharBindingData.binding.left);
        this.rightOctaveBoard = new OctaveBoard(rightOctave, NoteCharBindingData.binding.right);
        this.octaveBoards = [this.leftOctaveBoard, this.rightOctaveBoard];
    };
    
    Keyboard.prototype.getKeydownHandler = function() {
        return _.bind(function(event) {
            _.each(this.octaveBoards, function(board) {
                board._keydownHandler(event);
            });
        }, this);
    };
    
    Keyboard.prototype.getKeyupHandler = function(){
        return _.bind(function(event) {
           _.each(this.octaveBoards, function(board) {
               board._keyupHandler(event);
           });
        }, this);
    };
    
    Keyboard.prototype.getToggleNoteNameHandler = function(logic) {
        return function(event) {
            if(KeyCodeData.KeyNumberName[event.which] === '1') {
                logic();
            }
        };
    };
    
    Keyboard.prototype.getOctaveSwitchHandler = function() {
        return _.bind(function(event) {
            if (event.shiftKey && KeyCodeData.KeyNumberName[event.which] === 'g') {
                this.leftOctaveBoard.octave.switchOctaveUp();
            } else if (KeyCodeData.KeyNumberName[event.which] === 'g') {
                this.leftOctaveBoard.octave.switchOctaveDown();
            } else if (event.shiftKey && KeyCodeData.KeyNumberName[event.which] === 'h') {
                this.rightOctaveBoard.octave.switchOctaveUp();
            } else if (KeyCodeData.KeyNumberName[event.which] === 'h') {
                this.rightOctaveBoard.octave.switchOctaveDown();
            }
        }, this);
    };
    
    var Factory = function(leftOctave, rightOctave) {
        return new Keyboard(leftOctave, rightOctave);
    };
    
    return {
        create: Factory
    };
});