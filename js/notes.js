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
            this.sound.play(this.get('freq'));
            this.set('on', true);
        },
        
        stop: function() {
            this.set('on', false);
            this.sound.stop();
        }
    });
    
    var Notes = Backbone.Collection.extend({
        model: Note
    });
    
    var createOctave = function(octave){
        var notes = new Notes();
        var noteData = _.where(NoteData, {octave: octave});
        _.each(noteData, function(data) {
            notes.add({
                note: data.name,
                octv: data.octave,
                freq: data.frequency
            });
        });
        return notes;
    };
    
    return {
        Note: Note,
        createOctave: createOctave
    };
});
