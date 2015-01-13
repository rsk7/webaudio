/* global define */
define([
    'underscore',
    'backbone',
    'data/note_data',
    'harmonizer'
], function(_, Backbone, NoteData, Harmonizer) {
        
    var Note = Backbone.Model.extend({
        defaults: {
            note: null,
            freq: null,
            octv: null,
            on: false
        },
        
        initialize: function() {
            this.harmonizer = new Harmonizer();
        },

        setWaveType: function(waveType) {
            this.harmonizer.setWaveType(waveType);
        },

        setWaveTable: function(waveTable) {
            this.harmonizer.setWaveTable(waveTable);
        },
        
        play: function() {
            if(!this.get('on')) {
                this.harmonizer.play(this.get('freq'));
                this.set('on', true);
            }
        },
        
        stop: function() {
            if(this.get('on')) {
                this.set('on', false);
                this.harmonizer.stop();
            }
        },
        
        addHarmonic: function(harmonicNumber, intensity) {
            this.harmonizer.update(harmonicNumber, intensity);
        },
        
        removeHarmonic: function(harmonicNumber) {
            this.harmonizer.update(harmonicNumber, 0);
        }
    
    });


    // notes is a backbone collection 
    // with a method to create an octave with
    // the given octave number. So, it'll populate
    // the collection with correct note models
    // (with the correct frequencies for the octave)
    var createOctave = function(octave){
        var notes = new Notes();
        notes.createOctave(octave);
        return notes;
    };
    
    var Notes = Backbone.Collection.extend({
        model: Note,
        
        // octave should be a number
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
        
        setWaveType: function(waveType) {
            this.each(function(note) {
                note.setWaveType(waveType);
            });
        },

        setWaveTable:function(waveTable) {
            this.each(function(note) {
                note.setWaveTable(waveTable);
            });
        },
        
        switchOctaveUp : function() {
            this.switchOctave(++this.octave);
            this.octave = this.at(0).get("octv");
            this.trigger("change:octave", "up");
        },
        
        switchOctaveDown: function() {
            this.switchOctave(--this.octave);
            this.octave = this.at(0).get("octv");
            this.trigger("change:octave", "down");
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
        }
    }, { createOctave: createOctave });
    
    
    return Notes;
});
