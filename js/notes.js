/* global define */
define([
    'underscore',
    'backbone',
    'data/note_data',
    'sound'
], function(_, Backbone, NoteData, Sound) {
        
    var Note = Backbone.Model.extend({
        defaults: {
            note: null,
            freq: null,
            octv: null,
            on: false
        },
        
        initialize: function() {
            this.sound = new Sound.sound();
        },
        
        play: function() {
            if(!this.get('on')) {
                this.sound.play(this.get('freq'));
                this.set('on', true);
            }
        },
        
        stop: function() {
            if(this.get('on')) {
                this.set('on', false);
                this.sound.stop();
            }
        }
    });
    
    var Notes = Backbone.Collection.extend({
        model: Note,
        
        createOctave : function(octave) {
            this.octave = octave;
            var noteData = _.where(NoteData, {octave: octave});
            this.reset();
            _.each(noteData, function(data) {
                this.add({
                    note: data.name,
                    octv: data.octave,
                    freq: data.frequency
                });
            }, this);
        },
        
        switchOctaveUp : function() {
            this.switchOctave(++this.octave);
            this.octave = this.at(0).get("octv");
        },
        
        switchOctaveDown: function() {
            this.switchOctave(--this.octave);
            this.octave = this.at(0).get("octv");
        },
        
        switchOctave : function(octave) {
            var noteData = _.where(NoteData, {octave: octave});
            if(noteData !== undefined && noteData.length !== 0) {
                this.each(function(note) {
                    var data = _.findWhere(noteData, {name: note.get("note")});
                    note.set({
                        octv: data.octave, 
                        freq: data.frequency
                    });
                });
            }
            this.trigger("change:octave");
        }
    });
    
    var createOctave = function(octave){
        var notes = new Notes();
        notes.createOctave(octave);
        return notes;
    };
    
    return {
        Note: Note,
        createOctave: createOctave
    };
});
