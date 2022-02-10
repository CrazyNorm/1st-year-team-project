// constant document elements
const canvas = document.getElementById("cnv1");
const ctx = canvas.getContext("2d");
const gareth = document.getElementById("img1");

// some abitrary properties
let x = 0;
let y = 0;
const moveCooldown = 200; // delay between moving (ms)
let moveable = true;
let moving = false;

window.onload = function () {
  canvas.width = window.innerWidth * 0.75;
  canvas.height = window.innerHeight-100;
  ctx.drawImage(gareth, x, y, 16, 16);
}


// checks moveable and moves in the appropriate direction for which arrow button was pressed
function moveFunc(event) {
  if (moveable && moving) {		
		switch(event.target.id) {
		  case "up":
		    y -= 16;
		    break;
		  case "left":
		    x -= 16;
		    break;
		  case "down":
		    y += 16;
		    break;
		  case "right":
		    x += 16;
		    break;
		}

		drawFrame();

		setTimeout(function() {moveFunc(event);}, moveCooldown);
  }
}


// checks moveable and moves in the appropriate direction for which key was pressed
function keyUpFunc(event) {
  if (moveable) {
		switch(event.key) {
		  case "w":
		    y -= 16;
		    break;
		  case "a":
		    x -= 16;
		    break;
		  case "s":
		    y += 16;
		    break;
		  case "d":
		    x += 16;
		    break;
		}

		drawFrame();
  }
}


// refresh frame and set moveable to false for the duration of the cooldown
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gareth, x, y, 16, 16);
  moveable = false;
  setTimeout(function() {moveable = true;}, moveCooldown);
}


// add event listeners to the arrow buttons + key presses
let arrows = document.getElementsByClassName("arrow");
for (element of arrows) {
	element.addEventListener('touchstart', function(event) {
	  moving = true;
	  moveFunc(event);
	});
	element.addEventListener('touchend', function(event) {
	  moving = false;
	});
	element.addEventListener('mousedown', function(event) {
	  moving = true;
	  moveFunc(event);
	});
	element.addEventListener('mouseup', function(event) {
	  moving = false;
	});
}
document.addEventListener('keypress', keyUpFunc);
