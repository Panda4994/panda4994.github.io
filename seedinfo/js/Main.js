var preloadedimages = [];

function preloadImage(source) {
	var img = new Image();
	img.src = source;
	preloadedimages.push(img);
}

preloadImage("img/button_clicked.png");
preloadImage("img/button_hover.png");
preloadImage("img/button.png");
var updateOnMouseOverSubIn = true;
var mouseOverSubIn = false;
var elem = document.getElementById("subIn");
elem.addEventListener("mouseover", mouseOver);
elem.addEventListener("mouseout", mouseOut);

function mouseOver() {
	if (updateOnMouseOverSubIn) {
		document.getElementById("subIn").style.backgroundImage = "url('img/button_hover.png')";
	}
	mouseOverSubIn = true;
}

function mouseOut() {
	if (updateOnMouseOverSubIn) {
		document.getElementById("subIn").style.backgroundImage = "url('img/button.png')";
	}
	mouseOverSubIn = false;
}

function handleSeedInput(ev) {
	if (ev.keyCode === 13) {
		showSeedInfo(document.getElementById("seedIn").value);
	}
}

document.getElementById("subIn").addEventListener("click", function(ev) {
	showSeedInfo(document.getElementById("seedIn").value);
}, false);

document.addEventListener("DOMContentLoaded", function() {
	if (window.location.hash) {
		var strSeed = decodeURIComponent(window.location.hash.slice(1));
		document.getElementById("seedIn").value = strSeed;
		showSeedInfo(strSeed);
	}
});
