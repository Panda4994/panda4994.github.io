var seedInfo = (function(undefined) {
	"use strict";
	var INT_MIN = bigInt.one.shiftLeft(31).negate();
	var INT_MAX = bigInt.one.shiftLeft(31).minus(1);
	var LONG_MIN = bigInt.one.shiftLeft(63).negate();
	var LONG_MAX = bigInt.one.shiftLeft(63).minus(1);
	var MASK48 = bigInt.one.shiftLeft(48).minus(1);

	function checkSeed(str) {
		var res = new Object();
		res.enteredText = false;
		res.enteredNumber = false;
		res.enteredNothing = false;
		res.enteredZero = false;
		res.outOfRange = false;
		if (str.match("^[+-]?[0-9]+$") != null) {
			res.seed = bigInt(str);
			if (res.seed.leq(LONG_MIN) || res.seed.geq(LONG_MAX)) {
				res.seed = stringHash(str);
				res.outOfRange = true;
			} else {
				res.enteredNumber = true;
				if (res.seed.eq(bigInt.zero)) {
					res.enteredZero = true;
				}
			}
		} else {
			if (str === "") {
				res.seed = javaRandom(Math.floor(Math.random()*bigInt.one.shiftLeft(48))).nextLong();
				res.enteredNothing = true;
			} else {
				res.seed = stringHash(str);
				res.enteredText = true;
			}
		}
		res.byText = false;
		res.byRandom = false;
		res.byNumber = true;
		res.time = undefined;
		
		if (res.seed.geq(INT_MIN) && res.seed.leq(INT_MAX)) {
			res.byText = true;
			res.strings = generateStrings(res.seed, "<", 10);
			res.strings = res.strings.concat(generateStrings(res.seed, "`", 10));
		}
		if (res.seed.eq(bigInt.zero)) {
			res.byNumber = false;
		}
		res.rand = javaRandom.fromLong(res.seed);
		if (res.rand != undefined) {
			res.byRandom = true;
			res.time = res.rand.getSeed();
		}
		res.baseSeed = numHelper.breakLong(res.seed).and(MASK48);
		res.similarSeeds = [];
		for (var i=0; i<20; i++) {
			res.similarSeeds.push(numHelper.fixLong(res.baseSeed.add(bigInt(Math.floor(Math.random() * 65536)).shiftLeft(48))));
		}
		//for (var i=0; i<65536; i++) {
		//	res.similarSeeds.push(res.baseSeed.add(bigInt(i).shiftLeft(48)));
		//}
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

var showSeedInfo = (function(undefined) {
	function setDisplayByClassName(classname, display) {
		var targets = document.getElementsByClassName(classname);
		for (var i=0; i<targets.length; i++) {
			targets[i].style.display = display;
		}
	}

	function setValueByClassName(classname, value) {
		var targets = document.getElementsByClassName(classname);
		for (var i=0; i<targets.length; i++) {
			while (targets[i].firstChild) {
				targets[i].removeChild(targets[i].firstChild);
			}
			targets[i].appendChild(document.createTextNode(value));
		}
	}

	function setDisplayById(id, display) {
		var elem = document.getElementById(id);
		if (elem) {
			elem.style.display = display;
		}
	}

	function doAndSet(str) {
		var info = seedInfo(str);
		setValueByClassName("numseed seed", info.seed.toString());
		if (info.enteredZero) {
			setDisplayById("enteredZero", "inherit");
		}
		if (info.enteredText) {
			setDisplayById("enteredText", "inherit");
		}
		if (info.enteredNothing) {
			setDisplayById("enteredNothing", "inherit");
		}
		if (info.enteredNumber && !info.enteredZero) {
			setDisplayById("enteredNumber", "inherit");
		}
		if (info.outOfRange) {
			setDisplayById("enteredOutOfRange", "inherit");
		}
		if (info.byNumber) {
			if (!info.byText && !info.byRandom) {
				setDisplayByClassName("opttext numberCertain", "inherit");
			}
			setDisplayById("byNumber", "inherit");
		} else {
			setDisplayById("notByNumber", "inherit");
		}
		if (info.byText) {
			if (info.enteredText) {
				setDisplayByClassName("opttext enteredText", "inline");
			}
			for (var i=0; i<20; i++) {
				setValueByClassName("textseed " + (i+1), info.strings[i]);
			}
			setDisplayById("byText", "inherit");
		} else {
			setDisplayById("notByText", "inherit");
		}
		if (info.byRandom) {
			if (!info.byText) {
				setDisplayByClassName("opttext randomLikely", "inherit");
			}
			setDisplayById("byRandom", "inherit");
		} else {
			setDisplayById("notByRandom", "inherit");
		}
		setDisplayById("seed" + info.seed.toString(), "inherit");
		setValueByClassName("numseed base", info.baseSeed.toString());
		for (var i=0; i<20; i++) {
			setValueByClassName("numseed " + (i+1), info.similarSeeds[i].toString());
		}
		setDisplayById("similarSeeds", "inherit");
		/*if (info.time) {
			var date = new Date(info.time);
			if (date) {
				var start = new Date("2010-01-01T00:00:00Z");
				var end = new Date();
				if (date > start && date < end) {
					setValueByClassName("genTime", date.toString());
					setDisplayById("byTime", "inherit");
				}
			}
		}*/

		updateOnMouseOverSubIn = true;
		if (mouseOverSubIn) {
			document.getElementById("subIn").style.backgroundImage = "url('img/button_hover.png')";
		} else {
			document.getElementById("subIn").style.backgroundImage = "url('img/button.png')";
		}
	}

	function doStuff(str) {
		setDisplayByClassName("opttext", "none");
		setDisplayByClassName("listelement", "none");
		setValueByClassName("numseed", "");
		setValueByClassName("numseed zero", "0");
		setValueByClassName("genTime", "");
		updateOnMouseOverSubIn = false;
		document.getElementById("subIn").style.backgroundImage = "url('img/button_clicked.png')";
		setTimeout(doAndSet, 50, str);
	}

	return doStuff;
})();
