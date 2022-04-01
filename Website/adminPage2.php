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
    <title>Admin Page (Quest) </title>
    
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
        button:hover {
            cursor: pointer;
        }

        .tooltiptext {
            font-size: 0.75em;
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
        <form action="questSubmit.php" method="POST">
        <p class="text">
            This is the Quest managment page
        </p>
                
        <div class="tooltip text textTitle">Title : <span class="tooltiptext">The Title of the quest. (don't make it excessively long)</span></div> <input type="text" name = "title" placeholder="Title" class="textBlock">
        <div class="tooltip text textTitle">Description : <span class="tooltiptext">Text to display</span></div> <input type="text" name = "description" placeholder="Description" class="textBlock">
        <div class="tooltip text textTitle">Target Count : <span class="tooltiptext">Number for the amount of actions that should be completed to complete the quest</span></div> <input type="number" name = "targetCount" placeholder="Target Count" class="textBlock">
        <div class="tooltip text textTitle">Stat Changes : <span class="tooltiptext">Number to change stats by once quest is completed </span></div> <input type="number" class="numScroll" placeholder="Hunger" name="hunger"> <input type="number" class="numScroll" placeholder="Fatigue" name="sleep"> <input type="number" class="numScroll" placeholder="Money" name="money"> <input type="number" class="numScroll" placeholder="Grades" name="grades"> <input type="number" class="numScroll" placeholder="Social Life" name="socialLife">
        <div class="tooltip text textTitle">Actions : <span class="tooltiptext">JS Code check before using</span></div> <input type="text" name = "rewardActions" placeholder="Reward Actions" class="textBlock">
        <div class="tooltip text textTitle">Quest Requirements : <span class="tooltiptext">List of quest ids of format: 1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Quest Requirements" name= "quest_requirements">
        <div class="tooltip text textTitle">Interaction Requirements : <span class="tooltiptext">List of interaction ids of format 1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Interaction Requirements" name= "interaction_requirements">
        <div class="tooltip text textTitle">Updated by Quests : <span class="tooltiptext">List of quest ids that updates the quest count of format 1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Updated by Quests" name= "updated_by_quests">
        <div class="tooltip text textTitle">Updated by Interactions : <span class="tooltiptext">List of interaction ids that updates the quest count of format 1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Updated by Interactions" name= "updated_by_interactions">

        <button type="submit" class = "submit">Submit</button>

        </form>
        <button onclick='location.href="adminPage.php"' class="text textTitle">EDIT Interactions page</button>
        <button onclick='location.href="adminPage3.php"' class="text textTitle">EDIT NPC page</button>
        <button onclick='location.href="GamePage.php"' class="text textTitle">START GAME</button>
    </body>
</html>