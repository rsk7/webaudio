define([
    'underscore',
    'backbone',
    'data/note_data',
], function(_, Backbone, noteData) {
    
    var soundContext = (function(){
        if(typeof AudioContext === 'function') {
            return new AudioContext();
        } else if (typeof webkitAudioContext === 'function') {
            return new webkitAudioContext();
        } else {
            throw new Error("Could not context audio");
        }
    })();

    var sound = function(){
        this.attackTime = 0.1;
        this.releaseTime = 0.1;
        this.vco = soundContext.createOscillator();
        this.vco.type = this.vco.SINE;
        this.vca = soundContext.createGain();
        this.vca.gain.value = 0;
        this.vco.connect(this.vca);
        this.vca.connect(soundContext.destiation);
        this.on = false;
    };
    
    sound.prototype.freq = function(f) {
        this.vco.frequency.setValueAtTime(
            f, soundContext.currentTime);
        this.vco.frequency.value = f;
    };
    
    sound.prototype.envelopeStart = function() {
        var now = soundContext.currentTime;
        var attack = now + this.attackTime;
        this.vca.gain.cancelScheduledValues(now);
        this.vca.gain.setValueAtTime(0, now);
        this.vca.gain.linearRampToValueAtTime(1, attack);
    };
    
    sound.prototype.envelopeStop = function() {
        var now = soundContext.currentTime;
        var release = now + this.releaseTime;
        this.vca.gain.cancelScheduledValues(now);
        this.vca.gain.setValueAtTime(1, now);
        this.vca.gain.linearRampToValueAtTime(0, release);
    };
    
    sound.prototype.play = function(f) {
        this.freq(f);
        this.on = true;
        this.envelopeStart();
    };
    
    sound.prototype.stop = function() {
        this.on = false;
        this.envelopeStop();
    };
    
    var Note = Backbone.Model.extend({
        defaults: {
            note: null,
            freq: null,
            octv: null,
            ison: false
        },
        
        initialize: function() {
            this.sound = new sound;
        },
        
        on: function() {
            this.sound.play(this.freq);
            this.ison = true;
        },
        
        off: function() {
            this.ison = false;
            this.sound.stop();
        }
    });
    
    var getOctave = function(octave){
        return _.where(noteData, {octave: octave});
    };
    
    var Notes = Backbone.Collection.extend({
        model: Note
    });
    
    var Octave = Backbone.Collection.extend({
        model: Note,
        
        initialize: function(models, options) {
            this.octv = options.octave;
            _.each(getOctave(this.octv),
                   this.createNote,
                   this);
        },
        
        createNote: function(data) {
            this.add({
                note: data.name,
                octv: data.octave,
                freq: data.frequency
            });
        }
    });
    
    return {
        Note: Note,
        Notes: Notes,
        Octave: Octave
    };
});
