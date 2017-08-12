var seedInfo = (function(str) {
	var INT_MIN = bigInt.one.shiftLeft(31).negate();
	var INT_MAX = bigInt.one.shiftLeft(31).minus(1);
	var LONG_MIN = bigInt.one.shiftLeft(63).negate();
	var LONG_MAX = bigInt.one.shiftLeft(63).minus(1);

	function checkSeed(str) {
		res = new Object();
		res.enteredString = false;
		res.outOfRange = false;
		if (str.match("^[+-]?[0-9]+$") != null) {
			res.seed = bigInt(str);
			if (res.seed.leq(LONG_MIN) || res.seed.geq(LONG_MAX)) {
				res.seed = stringHash(str);
				res.outOfRange = true;
			}
		} else {
			res.seed = stringHash(str);
			res.enteredString = true;
		}
		res.byString = false;
		res.byRandom = false;
		res.byNumber = true;
		res.time = undefined;
		
		if (res.seed.geq(INT_MIN) && res.seed.leq(INT_MAX)) {
			res.byString = true;
			res.strings = generateStrings(res.seed, "<");
			res.strings = res.strings.concat(generateStrings(res.seed, "`"));
		}
		if (res.seed.eq(bigInt.zero)) {
			res.byNumber = false;
		}
		res.rand = javaRandom.fromLong(res.seed);
		if (res.rand != undefined) {
			res.byRandom = true;
			res.time = res.rand.getSeed();
		}
		return res;
	}

	function stringHash(str) {
		var ret = bigInt.zero;
		for (var i=0; i<str.length; i++) {
			ret = ret.times(31).add(str.charCodeAt(i));
		}
		return numHelper.fixInt(ret);
	}

	function generateStrings(seed, start) {
		var res = [];
		var base = "";
		while (res.length < 5) {
			base += start;
			var dist = numHelper.breakInt(seed).minus(numHelper.breakInt(stringHash(base)));
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
				dist = dist.add(bigInt.one.shiftLeft(32));
			}
		}
		return res;
	}

	return checkSeed;
})();
