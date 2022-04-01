<?php
session_start();

if(!isset($_SESSION['userid'])) {
	header('Location: homepage.html');
}

echo("<script type='text/javascript'>var userid = " . $_SESSION['userid'] . ";</script>");
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Game Page</title>
	<link rel="shortcut icon" type="image/png" href="resources/imgs/icon.png"/>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

		<style type="text/css">

			@media only screen and (min-width: 480px){

				.background {
				 	width: 100%;
				 	height: 100%;
				 	top: 0;
				 	left: 0;
				 	position: absolute;
				 	opacity: 50%;
	  
				}  
				
				.Game {
				 	width: 100%;
				 	height: 100%;
				 	top: 0;
				 	left: 0;
				 	position: absolute;	 
				} 

				.playButton {
					position: absolute; 
				    height: 20%;
					width: 80%;
					top: 50%;
				    left: 50%;
					transform: translate(-50%,-50%);
				    padding: 0.5em;
				    background: #660099;
				    color: #ffffff;
				    border-color: #ffffff;
				    border-width: 1px;
				    border-style: solid;
				    border-radius: 20px;
				    font-family: 'Press Start 2P';
				    font-weight: 400;
				    font-size: 2em;
				    text-align: center;
				    cursor:  pointer; 
				}

				.HowToPlay {
				    width: 	95%;
				    height: 40%;
				    background: #ffffff;
				    color: #660099;
				    border-color: #660099;
				    border-style: solid;
				    font-family: "Helvetica";
				    font-size: 45px;
				    line-height: 1.3;
				    text-align: center;
				    position: absolute; 
				    top: 98%;
				    left: 2.5%;

				}

				.headers {
					font-family: "Helvetica";
				    font-size: 26px;
				    font-weight: bold;
				    line-height: 1.3;
				    text-align: left;
				    text
				}

				.text {
					font-family: "Helvetica";
				    color: black;
				    font-size: 22px;
				    line-height: 1.5em;
				    text-align: left;

				}
			}

			@media only screen and (max-width: 480px){
				.background {
				 	width: 100%;
				 	height: 100%;
				 	top: 0;
				 	left: 0;
				 	position: absolute;
				 	opacity: 50%;
	  
				}  
				
				.Game {
				 	width: 100%;
				 	height: 100%;
				 	top: 0;
				 	left: 0;
				 	position: absolute;	
				}  

				.playButton {
				    position: absolute; 
				    min-height: 3em;
					max-width: 80%;
					top: 50%;
				    left: 50%;
					transform: translate(-50%,-50%);
				    padding: 0.5em;
				    background: #660099;
				    color: #ffffff;
				    border-color: #ffffff;
				    border-width: 1px;
				    border-style: solid;
				    border-radius: 20px;
				    font-family: 'Press Start 2P';
				    font-weight: 400;
				    font-size: 2em;
				    text-align: center;
				    cursor:  pointer; 
				}

				.HowToPlay {
				    width: 	95%;
				    height: 40%;
				    background: #ffffff;
				    color: #660099;
				    border-color: #660099;
				    border-style: solid;
				    font-family: "Helvetica";
				    font-size: 32px;
				    line-height: 1.3;
				    text-align: center;
				    position: absolute; 
				    top: 98%;
				    left: 2.5%;

				}

				.headers {
					font-family: "Helvetica";
				    font-size: 20px;
				    font-weight: bold;
				    line-height: 1.3;
				    text-align: left;
				    text
				}

				.text {
					font-family: "Helvetica";
				    color: black;
				    font-size: 16px;
				    line-height: 1.5em;;
				    text-align: left;

				}	

			}


		</style>


</head>
<body>
	<img src="resources/css/background.JPG" alt="Background"class="background">
	<div class="Game" id="gameDiv">

		<button class="playButton" id="playButton" onclick="Game.startGame()">Play</button>

	</div>
<!-- 	<div class="HowToPlay">

		UNI LIFE
		<hr>
		<p class="headers">
			How To Play UNI LIFE ?
		</p>
		<p class="text">
			UNI LIFE is a Role Play game. Play as a student and live the UNI experience by finishing courseworks, parting, and many more.
		</p>

		<p class="headers">
			Game Controls
		</p>
		<p class="text">
			<li class="text">USE the WASD and the ARROW keys to move</li>
			<li class="text">Press SHIFT to sprint </li>
			<li class="text">Press E when facing an NPC to get the quests</li>
		</p>


		<p class="headers">
			Links to temporary audio
		</p>
		<p class="text">Main game: 
			<a href="https://theirdogswereastronauts.bandcamp.com/album/neon-theatre">Get Up - Their Dogs Were Astronauts</a>
		</p>
		<p class="text">Frogger music:
			<a href="https://cloudkicker.bandcamp.com/album/the-discovery">Dysphoria - Cloudkicker</a>
		</p>
		<p class="text">NPC voice:
			<a href="https://freesound.org/people/TheSubber13/sounds/239901/">This</a>
		</p>
	</div> -->

	<script type="text/javascript" src ="objects/Game.js"></script>



</body>
</html>