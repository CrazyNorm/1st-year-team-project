// constant document elements
const canvas = document.getElementById("cnv1");
const ctx = canvas.getContext("2d");
const gareth = document.getElementById("img1");

// some abitrary properties
let x = 0;
let y = 0;
let moveCooldown = 0;
let nextDelay = 100/6;


// sets up the repeating frame-refresh once the page has loaded
window.onload = function() {
	setInterval(drawFrame, nextDelay);
};


// checks ove cooldown and moves in the appropriate direction for which arrow button was pressed
function clickFunc(event) {
  if (moveCooldown <= 0) {
  	moveCooldown = 10;
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
  }
}


// checks move cooldown and moves in the appropriate direction for which key was pressed
function keyUpFunc(event) {
  if (moveCooldown <= 0) {
  	moveCooldown = 10;
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
  }
}


// refresh frame and calculate delay until next frame (60 fps)
function drawFrame() {
  let start = new Date().getTime();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-100;
  moveCooldown--;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gareth, x, y, 80, 80);
  let end = new Date().getTime();

  nextDelay = Math.max(0, 100/6 - (end-start));
}


// add event listeners to the arrow buttons + key presses
let arrows = document.getElementsByClassName("arrow");
for (element of arrows) {
	element.addEventListener('touchstart', clickFunc);
	element.addEventListener('click', clickFunc);
}
document.addEventListener('keypress', keyUpFunc);
