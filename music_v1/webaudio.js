var ctx = ctx || {};

var sound = sound || {

	x : {
		noteIndex : 0,
		generate : function(){
			if(sound.x.noteIndex == note_list.length) {
				sound.x.noteIndex = 0;
			}
			var f = note_list[sound.x.noteIndex];
			sound.x.noteIndex++;
			return f;
		}
	},

	// for setting up the audiocontext
	// creates and sets the context property
	setupContext : function(){
		if(typeof AudioContext === 'function') {
			sound.context = new AudioContext();
		} else if (typeof webkitAudioContext === 'function') {
			sound.context = new webkitAudioContext();
		} else {
			throw new Error("Could not AudioContext");
		}
	},

	// constructor for sound cores
	core : function(){
		var oscillator;
		var frequency = sound.x.generate();

		this.play = function(){
			oscillator = sound.context.createOscillator();
			oscillator.connect(sound.context.destination);
			oscillator.frequency.value = frequency;
			oscillator.noteOn && oscillator.noteOn(0);
			console.log('f : ' + oscillator.frequency.value);
		}

		this.stop = function(){
			if(oscillator !== null){
				oscillator.noteOff && oscillator.noteOff(0);
			}
		}
	},

	// note index for notes list
	noteIndex : 0
};


var color = color || {
	toHex : function(n) {
		n = parseInt(n, 10);
		if (isNaN(n)) return "00";
		n = Math.max(0, Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)
			 + "0123456789ABCDEF".charAt(n%16);
	},

	rbgToHex : 	function(R, G, B) { 
		return "#" + color.toHex(R) + color.toHex(G) + color.toHex(B); 
	},

	colorGenerator : function(){
		function gen(){
			return (Math.random() * color_list.length) % color_list.length;
		}

		// return color.rbgToHex(gen(), gen(), gen());

		return color_list[Math.floor(gen())];
	},

	core : function(ui){
		this.play = function(){
			ui.color(color.colorGenerator());
		}

		this.stop = function(){
			ui.color("#EBEBEB")
		}
	}
};

// node collects cores
var node = node || function(ui, cores){
	var coreCollection = cores;
	this.ui = ui;

	this.start = function(){
		for(var i = 0; i < coreCollection.length; i++){
			coreCollection[i].play();
		}
	}

	this.stop = function(){
		for(var i = 0; i < coreCollection.length; i++){
			coreCollection[i].stop();
		}
	}

	ui.setup(this.start, this.stop);
};

$(function(){
	ctx.paper = new Raphael(50, 50, $(window).width() - 100, $(window).height() - 100);
	ctx.svg = $('svg');
	ctx.r = $('#r');
	ctx.svg.attr('height', $(window).height());
	ctx.svg.attr('width', $(window).width());
	sound.setupContext();

	var ui = function(x, y){
		var uiCtx = ctx.paper.rect(x, y, 40, 40);
		uiCtx.attr({"stroke" : "none", "fill" : "#EFEFEF"});
		this.color = function(c){
			uiCtx.attr({"fill" : c});
		};
		this.position = {
			x : x,
			y : y
		};
		this.setup = function(starter, stopper) {
			uiCtx.hover(starter, stopper);
		};
	};

	var nodes = [];

	for(var j = 0; j < 4; j++) {
		for(var i = 0; i < 3; i++){
			var u = new ui(j * 50 + 50, i * 50 + 50);
			var s = new sound.core();
			var c = new color.core(u);
			nodes.push(new node(u, [s, c]));
		}
	}

	for(var j = 0; j < 4; j++) {
		for(var i = 0; i < 3; i++) {
			var u = new ui(j * 50 + 50 + 300, i * 50 + 50);
			var s = new sound.core();
			var c = new color.core(u);
			nodes.push(new node(u, [s, c]));
		}
	}
	
	// key mappings
	/*
	$(function(){
		$(window).keydown(function(e){
			e.preventDefault();
			switch(e.which) {
				case 49 : { frequency : 55, type : 'down' }
			}
		});
	});
	*/
});

