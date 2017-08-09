var INT_MIN = bigInt.one.shiftLeft(31).negate();
var INT_MAX = bigInt.one.shiftLeft(31).minus(1);
var LONG_MIN = bigInt.one.shiftLeft(63).negate();
var LONG_MAX = bigInt.one.shiftLeft(63).minus(1);

var parseLong = function(seed) {
	var ret = bigInt(seed); // TODO Make sure Java-Rules apply
	return ret;
}

var checkSeed = function(str) {
	res = new Object();
	res.enteredString = false;
	res.outOfRange = false;
	if (str.match("^[+-]?[0-9]+$") != null) {
		res.seed = parseLong(str);
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
	}
	if (res.seed.eq(bigInt.zero)) {
		res.byNumber = false;
	}
	res.time = fromLong(res.seed);
	if (res.time != undefined) {
		res.byRandom = true;
	}
	return res;
}
