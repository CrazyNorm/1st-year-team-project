const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const mapImage = new Image();
const map = document.getElementById("map");
const player = document.getElementById("player");
const controlPad = document.getElementById("controls");
let controlCircle = document.getElementById("circle");

//Map sizes
const mapSize = [41,29];
const desiredTiles = 20;
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
let keysDown = 0;
let yKeys ={"w" : 0,
			"s":0,
			"touch":0};
let xKeys ={"a":0,
			"d":0,
			"touch":0};
let ongoingTouches = [];
var moveTouch = -1;




//Time variables
const nextFrame = 20;//milliseconds until next frame
const clock = new Date()
let preTime = clock.getTime()
let deltaTime = 0;
let playing = true;





let w = Math.floor(window.innerWidth/desiredTiles); //Tilewise map width
let h = Math.floor(window.innerHeight/desiredTiles); //Tilewise map height

let tilesize = Math.max(w,h) // Largest number of pixels per tile
let speed = tilesize*2;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//RECALCULATE AFTER SCREEN CHANGES

middleX = canvas.width/2;
middleY = canvas.height/2;


//Event Listeners
controlPad.addEventListener("touchmove",function(event) { handleMove(event)})
controlPad.addEventListener("touchstart", function(event) {handleStart(event)})
controlPad.addEventListener("touchend", function(event) {handleEnd(event)})
controlPad.addEventListener("touchcanel",function(event) {handleCancel(event)})
document.addEventListener("keydown", function(event){keyDownHandler(event)})
document.addEventListener("keyup", function(event){keyUpHandler(event)})


window.onload = function()
{
	mapWidth = tilesize*mapSize[0]
	mapHeight = tilesize*mapSize[1]
	ctx.drawImage(map, 0,0,mapWidth,mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);



	setInterval(function () {mainLoop()},nextFrame)
	
};


//Has never happened, no clue how it happens. but supposedly it happens
function handleCancel (event)
{
	console.log("CANCELLED")
	event.preventDefault()
	var touches = event.changedTouches;
	for (var i = 0; i < touches.length; i++)
	{
		idx = touchById(touches[i].identifier)
		if (idx>=0)
		{
			ongoingTouches.splice(idx,1);
		}
	}
}

//Stops movement, removes the touch from the ongoing touches.
function handleEnd (event)
{
	console.log("Touch End")
	event.preventDefault();
	var touches = event.changedTouches;
	for (var i = 0; i < touches.length; i++)
	{
		if (touches[i].identifier == moveTouch)
		{
			moveTouch = -1;
			keysDown --;
			xKeys["touch"] = 0
			yKeys["touch"] = 0
		}
		idx = touchById(touches[i].identifier)
		if (idx>=0)
		{
			ongoingTouches.splice(idx,1);
		}
	}
}

//Adds touch to ongoing touch list. starts movement if it is the 1st touch on the control pad
function handleStart (event)
{
	console.log("Touch Start")
	event.preventDefault();
	var touches = event.changedTouches;
	for (var i=0; i<touches.length;i++)
	{
		if (moveTouch < 0)
		{
			moveTouch = touches[i].identifier;
			keysDown ++;
			//probably can put this in a function
			let canvasRect = controlPad.getBoundingClientRect();
			mouseX = touches[i].pageX-canvasRect.left;
			mouseY = touches[i].pageY-canvasRect.top;
			let circleRect = controlCircle.getBoundingClientRect();
			controlCircle.style.left = String(mouseX-circleRect.width/2)+"px";
			controlCircle.style.top = String(mouseY-circleRect.height/2)+"px";
			controlCircle.style.backgroundColor = "red"
			var xdiff = canvasRect.width/2 - mouseX;
		    var ydiff = canvasRect.height/2 - mouseY;
		    var magnitude = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
		    xKeys["touch"] = xdiff/magnitude;
		    yKeys["touch"] = ydiff/magnitude;
		}
		ongoingTouches.push(copyTouch(touches[i]))
	}
}



function copyTouch ({identifier, pageX, pageY})
{
	return {identifier,pageX,pageY}
}


//finds the touch index by the id, -1 if it doesn't exist
function touchById(identifier)
{
	for (var i = 0; i < ongoingTouches.length; i++)
	{
		if (identifier == ongoingTouches[i].identifier)
		{
			return i;
		}
	}
	return -1;
}

//touch movement. moves the screen if the touch id is the same as the moveID defined in handleStart.
function handleMove (event)
{
	event.preventDefault();
	var touches = event.changedTouches;
	for (var i = 0; i < touches.length; i++)
	{
		idx = touchById(touches[i].identifier)
		if (idx>=0)
		{
			if (touches[i].identifier == moveTouch)
			{
				let canvasRect = controlPad.getBoundingClientRect();
				mouseX = ongoingTouches[idx].pageX-canvasRect.left;
				mouseY = ongoingTouches[idx].pageY-canvasRect.top;
				let circleRect = controlCircle.getBoundingClientRect();
				controlCircle.style.left = String(mouseX-circleRect.width/2)+"px";
				controlCircle.style.top = String(mouseY-circleRect.height/2)+"px";
				controlCircle.style.backgroundColor = "red"
				var xdiff = canvasRect.width/2 - mouseX;
			    var ydiff = canvasRect.height/2 - mouseY;
			    var magnitude = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
			    xKeys["touch"] = xdiff/magnitude;
			    yKeys["touch"] = ydiff/magnitude;
			}
			ongoingTouches.splice(idx,1,copyTouch(touches[i]))
		}
	}

	
}

function mainLoop()
{	
	let clock = new Date()
	let curTime = clock.getTime();
	deltaTime = (curTime - preTime)/1000;
	preTime = curTime;


	if (keysDown > 0)
	{
		playerDX = xKeys["a"] + xKeys["d"] + xKeys["touch"] // Sum of all inputs
		playerDY = yKeys["w"] + yKeys["s"] + yKeys["touch"]


		let m = Math.sqrt(playerDX*playerDX + playerDY*playerDY)
		if (m != 0)
		{
			let xdiff = (playerDX/m)*speed*deltaTime
			let ydiff = (playerDY/m)*speed*deltaTime
			playerX += Math.round(xdiff)
			playerY += Math.round(ydiff)		
		}	
		move()
	}
}

function move()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(map,playerX, playerY, mapWidth, mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);

}

function keyDownHandler(event)
{
	switch (event.code)
	{
		case "ShiftLeft":
			speed = tilesize*8;
			console.log("SPEED")
			break;
		case "ArrowUp":
		case "KeyW":
			moving = true
			yKeys["w"] = 1
			keysDown ++;
			break;
		case "ArrowDown":
		case "KeyS":
			moving = true
			yKeys["s"] = -1
			keysDown ++;
			break;
		case "ArrowLeft":
		case "KeyA":
			moving = true
			xKeys["a"] = 1
			keysDown ++;
			break;
		case "ArrowRight":
		case "KeyD":
			moving = true
			xKeys["d"] = -1
			keysDown ++;
			break;
	}
}
function keyUpHandler(event)
{
	switch (event.code)
	{
		case "ShiftLeft":
			speed = tilesize*2;
			break;
		case "ArrowUp":
		case "KeyW":
			yKeys["w"] = 0
			keysDown --;
			break;
		case "ArrowDown":
		case "KeyS":
			yKeys["s"] = 0
			keysDown --;
			break;
		case "ArrowLeft":
		case "KeyA":
			xKeys["a"] = 0
			keysDown --;
			break;
		case "ArrowRight":
		case "KeyD":
			xKeys["d"] = 0
			keysDown --;
			break;
		}
}
	