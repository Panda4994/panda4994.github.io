var javaRandom = (function(seed) {
	var MULT = bigInt("0x5DEECE66D");
	var ADD = bigInt("0xB");
	var MASK48 = bigInt.one.shiftLeft(48).minus(1);
	var MASK32 = bigInt.one.shiftLeft(32).minus(1);
	var MASK31 = bigInt.one.shiftLeft(31).minus(1);
	var MASK64 = bigInt.one.shiftLeft(64).minus(1);
	var MASK63 = bigInt.one.shiftLeft(63).minus(1);
	var TWO16 = bigInt.one.shiftLeft(16);
	var TWO16_RAW = bigInt.one.shiftLeft(16).toJSNumber();

	function RandomClass(seed) {
		return new Random(seed);
	}

	RandomClass.fromLong = function(l) {
		var i1 = l.shiftRight(32).and(MASK32);
		var i2 = l.and(MASK32);
		if (i2.gt(MASK31)) {
			i1 = i1.add(1);
		}
		var front = i1.shiftLeft(16);
		for (var i=0; i < TWO16_RAW; i++) {
			var seed = front.or(i);
			var i22 = seed.times(MULT).add(ADD).and(MASK48).shiftRight(16);
			if (i22.eq(i2)) {
				var ret = new Random();
				ret.setOrgSeed(seed);
				ret.previous();
				return ret;
			}
		}
		return undefined;
	}

	function Random(seed) {
		this.setSeed(bigInt(seed));
	}

	Random.prototype.setSeed = function(seed) {
		this.seed = bigInt(seed).xor(MULT).and(MASK48);
	}
	Random.prototype.getSeed = function() {
		return this.seed.xor(MULT);
	}

	Random.prototype.setOrgSeed = function(seed) {
		this.seed = bigInt(seed);
	}

	Random.prototype.getOrgSeed = function() {
		return this.seed;
	}

	Random.prototype.next = function(bits) {
		this.seed = this.seed.times(MULT).add(ADD).and(MASK48);
		return numHelper.fixInt(this.seed.shiftRight(48 - bits).and(MASK32));
	}

	Random.prototype.previous = function() {
		var p1 = bigInt.zero;
		for (var i=1; i<=48; i++) {
			var mask = bigInt.one.shiftLeft(i).minus(1);
			var p2 = p1.times(MULT).add(ADD).and(mask);
			if (p2.neq(this.seed.and(mask))) {
				p1 = p1.or(bigInt.one.shiftLeft(i-1));
			}
		}
		this.seed = p1;
	}

	Random.prototype.nextInt = function() {
		return this.next(32);
	}

	Random.prototype.nextLong = function() {
		return numHelper.fixLong(this.next(32).shiftLeft(32).add(this.next(32)));
	}

	return RandomClass;
})();

