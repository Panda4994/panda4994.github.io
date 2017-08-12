var numHelper = (function() {
	var retval = new Object();

	function mask(bits) {
		return bigInt.one.shiftLeft(bits).minus(bigInt.one);
	}

	retval.fixNum = function(num, bits) {
		var ret = num.and(mask(bits));
		if (ret.gt(mask(bits-1))) {
			return ret.xor(mask(bits)).add(bigInt.one).negate();
		} else {
			return ret;
		}
	}

	retval.fixInt = function(i) {
		return retval.fixNum(i, 32);
	}

	retval.fixLong = function(l) {
		return retval.fixNum(l, 64);
	}

	retval.breakNum = function(num, bits) {
		if (num.geq(bigInt.zero)) {
			return num;
		} else {
			return num.xor(mask(bits)).add(bigInt.one).negate();
		}
	}

	retval.breakInt = function(i) {
		return retval.breakNum(i, 32);
	}

	retval.breakLong = function(l) {
		return retval.breakNum(l, 64);
	}

	return retval;
})();
