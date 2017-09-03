var showSeedInfo = (function(undefined) {
	var w;

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
		setValues(info);
	}

	function setValues(info) {
		setValueByClassName("numseed seed", info.seed.toString());
		if (info.longerThan32) {
			setDisplayById("longerThan32", "inherit");
		}
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
		if (info.str.toLowerCase() === "herobrine") {
			setDisplayById("seedherobrine", "inherit");
		}
		if (info.str.toLowerCase() === "panda" || info.str.toLowerCase() === "panda4994") {
			setDisplayById("seed4994", "inherit");
		}
		setValueByClassName("numseed base", info.baseSeed.toString());
		for (var i=0; i<20; i++) {
			setValueByClassName("numseed " + (i+1), info.similarSeeds[i].toString());
		}
		setDisplayById("similarSeeds", "inherit");
		if (info.time) {
			var date = new Date(bigInt(info.time));
			if (date) {
				var start = new Date("2010-01-01T00:00:00Z");
				var end = new Date();
				setValueByClassName("genTime", date.toString());
				if (date > start && date < end) {
					setDisplayById("byTime", "inherit");
				} else {
					setDisplayById("notByTime", "inherit");
				}
			}
		}

		updateOnMouseOverSubIn = true;
		if (mouseOverSubIn) {
			document.getElementById("subIn").style.backgroundImage = "url('img/button_hover.png')";
		} else {
			document.getElementById("subIn").style.backgroundImage = "url('img/button.png')";
		}
		setDisplayById("loading", "none");
	}

	function doStuff(str) {
		if (str !== "") {
			document.location.hash = encodeURIComponent(str);
		}
		setDisplayById("loading", "inherit");
		setDisplayByClassName("opttext", "none");
		setDisplayByClassName("listelement", "none");
		setValueByClassName("numseed", "");
		setValueByClassName("numseed zero", "0");
		setValueByClassName("genTime", "");
		updateOnMouseOverSubIn = false;
		document.getElementById("subIn").style.backgroundImage = "url('img/button_clicked.png')";
		if (typeof(Worker) !== "undefined") {
			if (typeof(w) !== "undefined") {
				w.terminate();
			}
			w = new Worker("js/webworker.js");
			w.addEventListener('message', function(e) {
				if (e.data.enteredNothing) {
					document.location.hash = encodeURIComponent(e.data.seed.toString());
				}
				setValues(e.data);
			}, false);
		}
		if (typeof(w) !== "undefined") {
			w.postMessage(str);
		} else {
			setTimeout(doAndSet, 50, str);
		}
	}

	return doStuff;
})();
