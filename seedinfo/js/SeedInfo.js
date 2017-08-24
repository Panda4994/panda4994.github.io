var seedInfo = (function(undefined) {
	"use strict";
	var INT_MIN = bigInt.one.shiftLeft(31).negate();
	var INT_MAX = bigInt.one.shiftLeft(31).minus(1);
	var LONG_MIN = bigInt.one.shiftLeft(63).negate();
	var LONG_MAX = bigInt.one.shiftLeft(63).minus(1);
	var MASK48 = bigInt.one.shiftLeft(48).minus(1);

	function checkSeed(str) {
		var res = new Object();
		res.str = str;
		res.longerThan32 = false;
		if (str.length > 32) {
			res.longerThan32 = true;
		}
		res.enteredText = false;
		res.enteredNumber = false;
		res.enteredNothing = false;
		res.enteredZero = false;
		res.outOfRange = false;
		var seed;
		var baseSeed;
		var time;
		var rand;
		if (str.match("^[+-]?[0-9]+$") != null) {
			seed = bigInt(str);
			if (seed.leq(LONG_MIN) || seed.geq(LONG_MAX)) {
				seed = stringHash(str);
				res.outOfRange = true;
			} else {
				res.enteredNumber = true;
				if (seed.eq(bigInt.zero)) {
					res.enteredZero = true;
				}
			}
		} else {
			if (str === "") {
				seed = javaRandom(Math.floor(Math.random()*bigInt.one.shiftLeft(48))).nextLong();
				res.enteredNothing = true;
			} else {
				seed = stringHash(str);
				res.enteredText = true;
			}
		}
		res.byText = false;
		res.byRandom = false;
		res.byNumber = true;
		res.time = undefined;	
		if (seed.geq(INT_MIN) && seed.leq(INT_MAX)) {
			res.byText = true;
			res.strings = generateStrings(seed, "<", 10);
			res.strings = res.strings.concat(generateStrings(seed, "`", 10));
		}
		if (seed.eq(bigInt.zero)) {
			res.byNumber = false;
		}
		rand = javaRandom.fromLong(seed);
		if (rand != undefined) {
			res.byRandom = true;
			time = rand.getSeed();
			res.time = time.toString();
		}
		baseSeed = numHelper.breakLong(seed).and(MASK48);
		res.similarSeeds = [];
		for (var i=0; i<20; i++) {
			res.similarSeeds.push(numHelper.fixLong(baseSeed.add(bigInt(Math.floor(Math.random() * 65536)).shiftLeft(48))).toString());
		}
		//for (var i=0; i<65536; i++) {
		//	res.similarSeeds.push(res.baseSeed.add(bigInt(i).shiftLeft(48)));
		//}
		res.seed = seed.toString();
		res.baseSeed = baseSeed.toString();
		return res;
	}

	function stringHash(str) {
		var ret = bigInt.zero;
		for (var i=0; i<str.length; i++) {
			ret = ret.times(31).add(str.charCodeAt(i));
		}
		return numHelper.fixInt(ret);
	}

	function generateStrings(seed, start, amount) {
		var res = [];
		var base = "";
		while (res.length < amount) {
			base += start;
			var dist = seed.minus(stringHash(base));
			while (dist.lt(bigInt.zero)) {
				dist = dist.add(bigInt.one.shiftLeft(32));
			}
			while (bigInt(31).pow(base.length).gt(dist)) {
				var next = "";
				var tmp = dist;
				for (var i=0; i<base.length; i++) {
					var c = base.charCodeAt(i) + tmp.mod(31).toJSNumber();
					tmp = tmp.divide(31);
					next = String.fromCharCode(c) + next;
				}
				res.push(next);
				if (res.length >= amount) {
					return res;
				}
				dist = dist.add(bigInt.one.shiftLeft(32));
			}
		}
		return res;
	}

	return checkSeed;
})();
