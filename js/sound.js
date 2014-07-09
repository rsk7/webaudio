/* global define, window */
define([], function(){
    var soundContext = (function(){
        if(typeof window.AudioContext === 'function') {
            return new window.AudioContext();
        } else if (typeof window.webkitAudioContext === 'function') {
            return new window.webkitAudioContext();
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
        this.vco.start(0);
        this.vca.connect(soundContext.destination);
        this.on = false;
    };
    
    sound.prototype.freq = function(f){
        this.vco.frequency.setValueAtTime(f, soundContext.currentTime);
        this.vco.frequency.value = f;
    };
    
    sound.prototype.envelopeStart = function(){
        var now = soundContext.currentTime;
        var attack = now + this.attackTime;
        this.vca.gain.cancelScheduledValues(now);
        this.vca.gain.setValueAtTime(0, now);
        this.vca.gain.linearRampToValueAtTime(1, attack);
    };
    
    sound.prototype.envelopeStop = function(){
        var now = soundContext.currentTime;
        var release = now + this.releaseTime;
        this.vca.gain.cancelScheduledValues(now);
        this.vca.gain.setValueAtTime(1, now);
        this.vca.gain.linearRampToValueAtTime(0, release);
    };
    
    sound.prototype.play = function(frequency) {
        this.freq(frequency);
        this.on = true;
        this.envelopeStart();
    };
    
    sound.prototype.stop = function(){
        this.on = false;
        this.envelopeStop();
    };
    
    return { sound: sound };
});