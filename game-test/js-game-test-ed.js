// constant document elements
const canvas = document.getElementById("cnv1");
const ctx = canvas.getContext("2d");
const gareth = document.getElementById("img1");

// some abitrary properties
let x = 0;
let y = 0;
const moveCooldown = 200; // delay between moving (ms)
let moveable = true;

window.onload = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-100;
  ctx.drawImage(gareth, x, y, 80, 80);
}


// checks moveable and moves in the appropriate direction for which arrow button was pressed
function clickFunc(event) {
  if (moveable) {
		switch(event.target.id) {
		  case "up":
		    y -= 80;
		    break;
		  case "left":
		    x -= 80;
		    break;
		  case "down":
		    y += 80;
		    break;
		  case "right":
		    x += 80;
		    break;
		}

		drawFrame();
  }
}


// checks moveable and moves in the appropriate direction for which key was pressed
function keyUpFunc(event) {
  if (moveable) {
		switch(event.key) {
		  case "w":
		    y -= 80;
		    break;
		  case "a":
		    x -= 80;
		    break;
		  case "s":
		    y += 80;
		    break;
		  case "d":
		    x += 80;
		    break;
		}

		drawFrame();
  }
}


// refresh frame and set moveable to false for the duration of the cooldown
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gareth, x, y, 80, 80);
  moveable = false;
  setTimeout(function() {moveable = true;}, moveCooldown);
}


// add event listeners to the arrow buttons + key presses
let arrows = document.getElementsByClassName("arrow");
for (element of arrows) {
	element.addEventListener('touchstart', clickFunc);
	element.addEventListener('click', clickFunc);
}
document.addEventListener('keypress', keyUpFunc);
