$(function(){
	var paper = new Raphael(
		50, // viewport x
		50, // viewport y
		$(window).width() - 100, // width
		$(window).height() - 100 // height
	);

	var DIM = {

		btn : {
			height: 50,
			width: 50,
			padding: 10,
			radius: 4
		},

		sep : function() { return Math.floor(this.btn.width/2) },
		xstart : Math.floor($(window).width()/3),
		ystart : Math.floor($(window).height()/3)
	};

	//////
	// data { x, y }
	// color: colors the ui
	// responds to 'activate' & 'deactivate'
	//////
	var ui = function(data) {
		this.cores = [];
		var cbind;
		var active = false;
		var self = this;

		var fill = "#EBEBEB";
		var rect = paper.rect(
			data.x, 
			data.y, 
			DIM.btn.width,  
			DIM.btn.height, 
			DIM.btn.radius  
		).attr({
			"stroke" : "#EBEBEB",
			"stroke-width" : 5,
			"fill" : fill
		});

		this.height = function() {
			return rect.attr("height");
		}

		this.width = function() {
			return rect.attr("width");
		}

		this.color = function(c) {
			c = c || fill;
			rect.animate({"fill" : c}, 500, '>');
		};

		var getNoteInfo = function() {
			return noteProvider.getNote(
				cbind.note, 
				cbind.octave
			);
		};

		var text;
		var textOn = false;
		var textHoverOn = false;

		var setText = function(){

			var noteInfo = getNoteInfo();
			var infoText = noteInfo.octave + '\n' + noteInfo.name;

			if(typeof text === 'undefined') {
				text = paper.text(
					data.x + 4, 
					data.y + 12
				);

				function hoverLogic() {
					textHoverOn = !textHoverOn;
					(!textHoverOn && !textOn) ? this.hide() : this.show();
				}

				text.hover(hoverLogic, hoverLogic, text, text);
				rect.hover(hoverLogic, hoverLogic, text, text);
			}

			if(!textOn) {
				text.hide();
			}

			text.attr({'text-anchor' : 'start', 'text' : infoText});
		};

		var setFill = function() {
			var noteInfo = getNoteInfo();
			fill = (noteInfo.name.length > 1) ? "#C8C8C8" : "#EBEBEB";
			rect.attr({"fill" : fill});
		};

		this.btnBind = function(value){
			cbind = value;
			setText();
			setFill();
		}

		this.getBtnBind = function(){
			return cbind;
		};

		$(this).on('activate', function(){
			if(active === false) {
				_.each(this.cores, function(core) {
					core.play(self.getBtnBind());
				});
			}
			active = true;
		});

		$(this).on('deactivate', function(){
			if(active === true) {
				_.each(this.cores, function(core) {
					core.stop();
				});
			}
			active = false;
		});

		// keybindings
		$(window).keydown(function(e) {
			
			e.preventDefault();

			if(e.which === key_codes[self.getBtnBind().character]) {
				$(self).trigger('activate');
			}

			if(e.which === key_codes['b']) {
				textOn = !textOn;
				if(!textHoverOn) {
					(text.node.style.display === 'none') ?
						text.show() :
						text.hide();
				}
			}

			return false;
		});

		$(window).keyup(function(e) {

			e.preventDefault();

			if(e.which === key_codes[self.getBtnBind().character]) {
				$(self).trigger('deactivate');
			}

			return false;
		});
	}

	//////
	// color : core
	//////
	var color = function(ui) {

		var index = Math.floor(
			Math.random() * color_list.length
		);

		var value = color_list[index];

		this.play = function() {
			ui.color(value);
		};

		this.stop = function() {
			ui.color();
		};

	};

	//////
	// sound : core
	//////
	var sound = function(ui) {

		var ctx = this.builder.context();
		var attackTime = 0.1;
		var releaseTime = 0.1;

		var vco = ctx.createOscillator();
		vco.type = vco.SINE;

		function setFrequency(noteData) {
			if(typeof noteData !== 'undefined') {
				var f = noteProvider.getNote(
					noteData.note, noteData.octave
				);
				vco.frequency.setValueAtTime(f.frequency, ctx.currentTime);
				vco.frequency.value = f.frequency;
			}
		}

		var vca = ctx.createGain();
		vca.gain.value = 0;

		vco.connect(vca);
		vca.connect(ctx.destination);

		var vcoOn = false;
		function on(){
			if(!vcoOn) {
				vco.noteOn && vco.noteOn(0);
			}
			vcoOn = !vcoOn;
		}

		this.play = function(noteData) {
			setFrequency(noteData);
			on();

			// envelope stuff
			var now = ctx.currentTime;
			vca.gain.cancelScheduledValues(now);
			vca.gain.setValueAtTime(0, now);
			vca.gain.linearRampToValueAtTime(1, now + attackTime);
			console.log('f : ' + vco.frequency.value);

		}

		this.stop = function() {
			var now = ctx.currentTime;
			vca.gain.cancelScheduledValues(now);
			vca.gain.setValueAtTime(1, now);
			vca.gain.linearRampToValueAtTime(0, now + releaseTime);
		}
	};

	sound.prototype.builder = {
		context: function() {
			if(this.ctx === undefined) {
				if(typeof AudioContext === 'function') {
					this.ctx = new AudioContext();
				} else if (typeof webkitAudioContext === 'function') {
					this.ctx = new webkitAudioContext();
				} else {
					throw new Error('Could not audiocontext');
				}
			} 
			return this.ctx;
		}
	};

	var octaveGroup = function(bindingArray, octave, switchCode, spacing){

		octave = typeof octave !== 'undefined' ? octave : 0;
		spacing = typeof spacing !== 'undefined' ? spacing : 0;

		this.uis = [];
		var btnBinding = bindingArray;
		var self = this;

		var octRec = paper.rect(
			DIM.xstart + spacing - 10, 
			DIM.ystart - 10, 
			(DIM.btn.width + DIM.btn.padding) * 4 + 10,  
			(DIM.btn.height + DIM.btn.padding) * 3 + 10, 
			DIM.btn.radius  
		).attr({
			"stroke-width" : 0,
			"fill" : randomColor(),
			"opacity" : 0	
		});

		for(var j = 0; j < 3; j++) {
			for(var i = 0; i < 4; i++) {
				var u = new ui({
					x : i * (DIM.btn.width + DIM.btn.padding) + DIM.xstart + spacing,
					y : j * (DIM.btn.height + DIM.btn.padding) + DIM.ystart
				});
				u.cores.push(new sound(u));
				u.cores.push(new color(u));
				this.uis.push(u);
			}
		}

		function buttonBind() {
			_.each(this.uis, function(ui, index) {
				ui.btnBind($.extend({}, btnBinding[index], {'octave' : octave}));
			});
		}

		buttonBind.apply(this);

		this.setBinding = function(btnBindingArray) {
			btnBinding = btnBindingArray;
			buttonBind.apply(this);
		};

		this.shiftOctaveUp = function() {
			if(octave < noteProvider.highestOctave) {
				octave++;

				/*
				octRec.attr("fill", "LightSteelBlue");
				octRec.animate(
					{"opacity" : 0.75}, 
					200, 
					'>', 
					function(){
						octRec.animate({"opacity" : 0}, 200);
					}
				);
				*/

				buttonBind.apply(this);
			}
		};

		this.shiftOctaveDown = function(){
			if(octave > noteProvider.lowestOctave) {
				octave--;

				/*
				octRec.attr("fill", "MediumSeaGreen");
				octRec.animate(
					{"opacity" : 0.75}, 
					200, 
					'>', 
					function(){
						octRec.animate({"opacity" : 0}, 200);
					}
				);
				*/

				buttonBind.apply(this);
			}
		};

		$(window).keydown(function(e) {

			e.preventDefault();

			if(e.which === switchCode && e.shiftKey) {
				self.shiftOctaveUp();
			} else if (e.which === switchCode) {
				self.shiftOctaveDown();
			}

		});
	};


	////////
	// let's build the board !!!
	////////

	var leftGroup =	new octaveGroup(note_char_binding.left, 2, key_codes['g']);
	var btnspace = (DIM.btn.width + DIM.btn.padding);
	var spacing = 4 * btnspace + DIM.sep();
	var	rightGroup = new octaveGroup(note_char_binding.right, 3, key_codes['h'], spacing);

	$(window).keydown(function(e) {
		e.preventDefault();
		if(e.which === key_codes['1']) {
			leftGroup.setBinding(note_char_binding.left);
			rightGroup.setBinding(note_char_binding.right);
		} 
		if(e.which === key_codes['2']) {
			leftGroup.setBinding(alt_note_char_binding.left);
			rightGroup.setBinding(alt_note_char_binding.right);
		}
	});


});