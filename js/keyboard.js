/* global define */
define([
    'jquery',
    'underscore',
    'data/key_codes',
    'data/note_char_binding'
], function($, _, KeyCodeData, NoteCharBindingData){
    
    var invertObject = function(obj) {
        var newObj = {};
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                newObj[obj[prop]] = prop;
            }
        }
        return newObj;
    };
    
    var invertedKeyCodeData = invertObject(KeyCodeData);
    
    var OctaveBoard = function(octave, binding) {
        this.octave = octave;
        this.binding = binding;
    };
    
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
        this._keyToActionResolver(invertedKeyCodeData[event.which], 'play');
    };

    OctaveBoard.prototype._keyupHandler = function(event) {
        this._keyToActionResolver(invertedKeyCodeData[event.which], 'stop');
    };
    
    var Keyboard = function(leftOctave, rightOctave) {
        this.octaveBoards = [
            new OctaveBoard(leftOctave, NoteCharBindingData.binding.left),
            new OctaveBoard(rightOctave, NoteCharBindingData.binding.right)
        ];
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
    
    var Factory = function(octaves) {
        return new Keyboard(octaves[0], octaves[1]);
    };
    
    return {
        create: Factory
    };
});