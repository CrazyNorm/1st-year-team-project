const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const mapImage = new Image();
const map = document.getElementById("map");
const player = document.getElementById("player");


//Map sizes
const mapSize = [41,29]
const tilesize = 80;
let mapWidth = 0;
let mapHeight = 0;




//Player Constants
const moveCooldown = 200;
let moveCounter = 0;
let fov = 20;
let moving = false;
let playerX = 0;
let playerY = 0;
let playerDX = 0;
let playerDY = 0;
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let speed = tilesize*2;


//Time variables
const nextFrame = 20;//milliseconds until next frame
const clock = new Date()
let preTime = clock.getTime()
let deltaTime = 0;
let playing = true;



let w = Math.floor(window.innerWidth/tilesize); //Tilewise map width
let h = Math.floor(window.innerHeight/tilesize); //Tilewise map height

canvas.width = w*tilesize;
canvas.height = h*tilesize;

//RECALCULATE AFTER SCREEN CHANGES

middleX = canvas.width/2;
middleY = canvas.height/2;


//Event Listeners
canvas.addEventListener("pointermove",function(event) {
	let canvasRect = canvas.getBoundingClientRect();
	mouseX = event.clientX-canvasRect.left
	mouseY = event.clientY-canvasRect.top
	var xdiff = middleX - mouseX;
    var ydiff = middleY - mouseY;
    var magnitude = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
    playerDX = xdiff/magnitude;
    playerDY = ydiff/magnitude;
})
canvas.addEventListener("pointerdown", function(event) {
	moving = true;
})
canvas.addEventListener("pointerup", function(event) {
	moving = false;
})
document.addEventListener("keydown", function(event){ keyDownHandler(event)})
document.addEventListener("keyup", function(event){ keyUpHandler(event)})





window.onload = function()
{
	let ppt = canvas.width/20;
	mapWidth = ppt*mapSize[0]
	mapHeight = ppt*mapSize[1]
	ctx.drawImage(map, 0,0,mapWidth,mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);



	setInterval(function () {mainLoop()},nextFrame)
	
};


function mainLoop()
{	
	let clock = new Date()
	let curTime = clock.getTime();
	deltaTime = (curTime - preTime)/1000;
	preTime = curTime;

	player

	if (moving)
	{
		let m = Math.sqrt(playerDX*playerDX + playerDY*playerDY)
		playerX += Math.round(playerDX*speed*deltaTime/m)
		playerY += Math.round(playerDY*speed*deltaTime/m)
		move()
	}
}

function move()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(map,Math.round(playerX), Math.round(playerY), mapWidth, mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);

}

function keyDownHandler(event)
{
	switch (event.key)
	{
		case "Shift":
			speed = tilesize*8;
			break;
		case "w":
			moving = true
			playerDY -= 1;
			break;
		case "s":
			moving = true
			playerDY += 1;
			break;
		case "a":
			moving = true
			playerDX -= 1;
			break;
		case "d":
			moving = true
			playerDX += 1;
			break;
	}
}
function keyUpHandler(event)
{
	switch (event.key) 
	{
		case "Shift":
			speed = tilesize*2;
			break;
		case "w":
			playerDY += 1;
			break;
		case "s":
			playerDY -= 1;
			break;
		case "a":
			playerDX += 1;
			break;
		case "d":
			playerDX -= 1;
			break;
	}
}
	