/* global define */
define([
    'underscore',
    'sound'
], function(_, Sound) {
    // harmonics
    // Something to manage the gain for harmonic frequencies
    var Harmonizer = function(sound) {
        // array where each index represents a harmonic. 
        // The value at that index is a sound object
        this.config = [];
        this.update(1, 1);
        this.update(2, 0.5);
        this.update(3, 0.25);
    };
    
    // number is the harmonic number
    Harmonizer.prototype.update = function(number, gain) {
        // greater than zero
        // between 0 and 1
        number = (number < 0) ? 0 : number;
        gain = (gain > 1) ? 1 : ((gain < 0) ? 0 : gain);
        
        if(gain === 0) {
            delete this.config[number];
        } else {
            this.config[number] = new Sound();
            this.config[number].amplitude = gain;
        }
    };
    
    Harmonizer.prototype.play = function(frequency) {
        _.each(this.config, function(s, index) {
            s.play(frequency * index);
        });
    };
    
    Harmonizer.prototype.setWaveType = function(waveType) {
        _.each(this.config, function(s) {
            s.waveType(waveType);
        });
    };

    Harmonizer.prototype.setWaveTable = function(waveTable) {
        _.each(this.config, function(s) {
            s.setWaveTable(waveTable);
        });
    };
    
    Harmonizer.prototype.stop = function() {
        _.each(this.config, function(s) {
            s.stop();
        });
    };

    return Harmonizer;
});
