const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const mapImage = new Image();
const map = document.getElementById("map");
const player = document.getElementById("player");
const controlPad = document.getElementById("controls");
let controlCircle = document.getElementById("circle");
let loop;

//Map sizes
const mapSize = [41,29];
const desiredTiles = 20;
let mapWidth = 0;
let mapHeight = 0;
let tilesize = 0;
let collisionBoxes;

//Player Constants
const moveCooldown = 200;
let moveCounter = 0;
let fov = 20;
let moving = false;
let playerX = 100;
let playerY = 100;
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
let moveTouch = -1;
let speed = 0;




//Time variables
const nextFrame = 10;//milliseconds until next frame
const clock = new Date()
let preTime = clock.getTime()
let deltaTime = 0;
let playing = true;


resizeHandler()


//Event Listeners


window.onload = function()
{
	mapWidth = tilesize*mapSize[0]
	mapHeight = tilesize*mapSize[1]
	ctx.drawImage(map, 0,0,mapWidth,mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);


	//MOBILE DETECTION
	var hasTouchScreen = false;
	if ("maxTouchPoints" in navigator) {
	    hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ("msMaxTouchPoints" in navigator) {
	    hasTouchScreen = navigator.msMaxTouchPoints > 0;
	} else {
	    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
	    if (mQ && mQ.media === "(pointer:coarse)") {
	        hasTouchScreen = !!mQ.matches;
	    } else if ('orientation' in window) {
	        hasTouchScreen = true; // deprecated, but good fallback
	    } else {
	        // Only as a last resort, fall back to user agent sniffing
	        var UA = navigator.userAgent;
	        hasTouchScreen = (
	            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
	            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
	        );
	    }
	}
	if (hasTouchScreen)
	{
		controlPad.style.display = "block";
	}
	resizeHandler()


	controlPad.addEventListener("touchmove",function(event) {handleMove(event)})
	controlPad.addEventListener("touchstart", function(event) {handleStart(event)})
	controlPad.addEventListener("touchend", function(event) {handleEnd(event)})
	controlPad.addEventListener("touchcanel",function(event) {handleCancel(event)})
	document.addEventListener("keydown", function(event){keyDownHandler(event)})
	document.addEventListener("keyup", function(event){keyUpHandler(event)})
	window.addEventListener("resize",function(event){resizeHandler()})
	mainLoop();
};

function debug()
{
	console.log(playerX,playerY)
}

function collisionDetection ()
{
	ppoint1 = {"x" : playerX-tilesize/2, "y" : playerY-tilesize/2}
	ppoint2 = {"x" : playerX+tilesize/2, "y" : playerY+tilesize/2}
	for (box of collisionBoxes)
	{
		if (ppoint1.x < box[1].x && ppoint2.x > box[0].x)
		{
			
			if (ppoint1.y < box[1].y && ppoint2.y > box[0].y)
			{
				let boxWidth = box[1].x-box[0].x
				let boxHeight = box[1].y-box[0].y
				let boxCentre = {"x" : (boxWidth)/2+box[0].x,
								 "y" : (boxHeight)/2+box[0].y}
				diffx = playerX - boxCentre.x;
				diffy = playerY - boxCentre.y;
				console.log(boxCentre)
				console.log(Math.abs(boxWidth/boxHeight),Math.abs(diffx/diffy),diffx,diffy)
				if (Math.abs(boxWidth/boxHeight)>Math.abs(diffx/diffy))
				{
					console.log(diffy)
					if (diffy > 0)
					{
						console.log("bottom")
						playerY = box[1].y+tilesize/2
					} else
					{
						console.log("top")
						playerY = box[0].y-tilesize/2
					}
				} else
				{
					if (diffx > 0)
					{
						console.log("right")
						playerX = box[1].x+tilesize/2
					} else
					{
						console.log("left")
						playerX = box[0].x-tilesize/2
					}
				}

			}
		}
	}
}

function calcBoundingBoxes ()
{
	collisionBoxes = []
	for (box of boundingBoxes)
	{
		topleft = {"x" : box[0]*tilesize, "y" : box[1]*tilesize}
		botright = {"x" : (box[2]+1)*tilesize, "y" : (box[3]+1)*tilesize}
		collisionBoxes.push([topleft,botright])
	}
}

function resizeHandler()
{
	console.log("Reszied")
	let w = Math.floor(window.innerWidth/desiredTiles); //Tilewise map width
	let h = Math.floor(window.innerHeight/desiredTiles); //Tilewise map height

	tilesize = Math.max(w,h) // Largest number of pixels per tile
	speed = tilesize*2;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	middleX = canvas.width/2;
	middleY = canvas.height/2;
	mapWidth = tilesize*mapSize[0]
	mapHeight = tilesize*mapSize[1]
	calcBoundingBoxes();
	ctx.drawImage(map, Math.round(-playerX+middleX), Math.round(-playerY+middleY),mapWidth,mapHeight);
	ctx.drawImage(player,middleX-tilesize/2,middleY-tilesize/2,tilesize,tilesize);
}



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
			ongoingTouches.splice(idx,1);
			let circleRect = controlCircle.getBoundingClientRect();
			controlCircle.style.margin = "auto";
			controlCircle.style.left = "0";
			controlCircle.style.top = "0";
			controlCircle.style.backgroundColor = "gray"
		}
		idx = touchById(touches[i].identifier)
		if (idx>=0)
		{

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
			controlCircle.style.margin = "0";
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

async function mainLoop()
{	
	let cdPromise = new Promise(function(resolve, reject) {
      setTimeout(resolve, nextFrame);
    });
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
			let canvasRect = controlPad.getBoundingClientRect();
			let xdiff = (playerDX/m)*speed*deltaTime
			let ydiff = (playerDY/m)*speed*deltaTime

			
			playerX += xdiff
			playerY += ydiff 
			collisionDetection()
		}	
		move()
	}
	await cdPromise;
	mainLoop();
}

function move()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(map,Math.round(middleX-playerX), Math.round(-playerY+middleY), mapWidth, mapHeight);
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
			yKeys["w"] = -1
			keysDown ++;
			break;
		case "ArrowDown":
		case "KeyS":
			moving = true
			yKeys["s"] = +1
			keysDown ++;
			break;
		case "ArrowLeft":
		case "KeyA":
			moving = true
			xKeys["a"] = -1
			keysDown ++;
			break;
		case "ArrowRight":
		case "KeyD":
			moving = true
			xKeys["d"] = +1
			keysDown ++;
			break;
		case "KeyP":
			debug();
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
	