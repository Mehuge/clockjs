(function(global) {
	var s1, offset = 0, latency = 0, onready, TZ = (new Date()).getTimezoneOffset(), Clock = function() {
		var running = false, 
			clocks = { id: 0, count: 0, ticks: 0 },
			tick = function() {
				clocks.ticks ++;
				clocks.now = interface.now();
				clocks.drift = clocks.now % 1000;
				for (var key in clocks) {
					if (clocks.hasOwnProperty(key)) {
						var clock = clocks[key];
						if (typeof clock === "object") {
							clock.now = clocks.now;
							clock.drift = clocks.drift;
							if (clock.when) {
								var diff = clock.diff = clock.when.valueOf() - clock.now + clocks.drift,
									countdown = clock.countdown = { };
								countdown.ms = diff % 1000;
								diff = (diff/1000)|0;
								countdown.s = diff % 60;
								diff = (diff/60)|0;
								countdown.m = diff % 60;
								diff = (diff/60)|0;
								countdown.h = diff % 24;
								diff = (diff/24)|0;
								countdown.d = diff;
							}
							clock.tick(clock);
						}
					}
				}
				if (running) {
					global.setTimeout(tick, 1000 - clocks.drift);
				}
			},
			start = function() {
				if (!running) {
					running = true;
					global.setTimeout(tick, 1000 - (interface.now() % 1000));
				}
			},
			stop = function() {
				running = false;
			},
			adjust = function() {
				var t = (s1 = (new Date()).getTime()),			// UTC time
					head = document.getElementsByTagName("head")[0],
					script = document.createElement("script");
				script.src = "http://clock.sorcerer.co.uk/GMT.js.php?t="+t;
				head.appendChild(script);
			},
			interface = {
				ready: function(fn) {
					onready = fn;
					onready.clock = this;
					return this;
				},
				now: function() {
					return (new Date()).getTime() - offset;
				},
				UTC: function() {
					return (new Date()).getTime() - offset;
				},
				createEvent: function(when, tick) {
					if (typeof when == "string") when = Clock.makeTime(when,0);	// assume GMT time
					var id = clocks.id++;
					clocks.count++;
					clocks[id] = { tick: tick, when: when };
					start();
					return {
						cancel: function() {
							delete clocks[id];
							clocks.count--;
							if (clocks.count == 0) stop();
						}
					};
					return this;
				},
				createClock: function(tick) {
					return this.createEvent(null, tick);
				}
			};
		adjust();
		return interface;
	};
	Clock.calcAdjust = function(diff) {
		var n = (new Date()).getTime();
		latency = n - s1;
		offset = diff + (latency/2)|0;
		console.log('Clock: Time adjust ' + offset + ' latency ' + latency + 'ms');
		if (onready) onready(onready.clock);
	};
	Clock.makeTime = function(yy,mm,dd,h,m,s,off) {
		if (typeof yy == "string") {
			off = mm|0;
			var a = yy.split(/[:T \/Z-]/);
			yy = a[0]|0; mm = a[1]|0; dd = a[2]|0;
			h = a[3]|0; m = a[4]|0; s = a[5]|0;
		}
		if (off >= -12 && off <= 12) { off *= 60; }
		var tzadj = -(off + TZ);
		return new Date(yy,mm-1,dd,h,m+tzadj,s);
	};
	(global.document.window ? global.document.window : global).Clock = Clock;
})(window);
