<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: homepage.html');
}
else if ($_SESSION['is_admin'] != 1) {
    header('Location: GamePage.php');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page (NPC) </title>
    
    <link rel="shortcut icon" type="image/png" href="resources/imgs/icon.png"/>
    <link rel="stylesheet" type="text/css" href="resources/css/website_style.css">
    <style type="text/css">
        .text {
            font-family: "Helvetica";
            color: Black;
            font-size: 2em;
            line-height: 1;
            text-align: center;
            background: white;
         }

       .submit {
            display: inline-block;
            font-size: 2em;
            color: yellow;
            height: 2em;
            background: #660099;
            border-color: #ffffff;
            border-color: black;
        }
        .submit:hover {
            background: #bb33ff;
        }

        .textBlock {
            background-color: whitesmoke;
            
            width: 78%;
            font-size: 2em;
            padding: 0.1em;
            margin-bottom: 0.2em;
        }

        .textTitle {
            padding: 0.1em;
            display: inline-block;
            color: yellow;
            background: #660099;
            border: solid;
            border-color: black;
            position: relative;
            width : 20%;
            text-align: right;

        }
        .numScroll {
            font-size: 2em;
            display: inline-block;
            background-color: whitesmoke;
            padding: 0.1em;
            margin-bottom: 0.2em;
            width: 15%;
        }
        .checkbox {
            font-size: 2em;
            width: 1.2em;
            height: 1em;
        }
        .smaller {
            font-size: 1em;
            width: auto;
        } 
        button:hover {
            cursor: pointer;
        }
        .tooltiptext {
            position: absolute;
            z-index: 2;
            visibility: hidden;
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            left: 50%;
        }

        .tooltip:hover .tooltiptext {
            visibility: visible;
        }
    </style>
</head>
    <body>
        <form action="npcSubmit.php" method="POST">
        <p class="text">
            NPC Managment Page
        </p>
                
        <div class="tooltip text textTitle">Name : <span class="tooltiptext">Text for the name of NPC. Try to keep Unique</span></div> <input type="text" name = "name" placeholder="Name" class="textBlock">
        <div class="tooltip text textTitle">Coordinates : <span class="tooltiptext">Integer for X and Y Tile positions on the map</span></div> <input type="number" class="numScroll" placeholder="X" name="x"> <input type="number" class="numScroll" placeholder="Y" name="y"> <br>
        <div class="tooltip text textTitle">Character Type : <span class="tooltiptext">Character Type Filename eg. Gareth</span></div> <input type="text" name = "character_type" placeholder="Character Type" class="textBlock">
        <div class="tooltip text textTitle">Interactions : <span class="tooltiptext">List of interaction ids of format 1,2,3,4 where 1 is most important and 4 is least important. Default interactions should be less important</span></div> <input type="text" class="textBlock" placeholder="Interactions" name= "interactions">
        <div class="tooltip text textTitle">Direction : <span class="tooltiptext">Direction for sprite to face</span></div> <div class="text textTitle smaller">N :</div> <input type="radio" class="checkbox" name="direction" value='N'> <div class="text textTitle smaller">E :</div> <input type="radio" class="checkbox" name="direction" value='E'> <div class="text textTitle smaller">S :</div> <input type="radio" class="checkbox" name="direction" value='S'> <div class="text textTitle smaller">W :</div> <input type="radio" class="checkbox" name="direction" value='W'>
        <br>
        <button type="submit" class = "submit">Submit</button>

        </form>
        <button onclick='location.href="adminPage2.php"' class="text textTitle">EDIT Quests page</button>
        <button onclick='location.href="adminPage.php"' class="text textTitle">EDIT Interactions page</button>
        <button onclick='location.href="GamePage.php"' class="text textTitle">START GAME</button>
    </body>
</html>