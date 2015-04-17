var sound = require("../js/sound");
var assert = require("assert");

describe("sound", function() {
    describe("#freq", function() {
        it('should set the vco frequency to specified value', function() {
            var s = new sound();
            var value = 200;
            s.freq(value);
            assert.equals(s.vco.frequency.value, value);
        });
    });
});
