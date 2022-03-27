<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page (NPC) </title>
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
            font-size: 2em;
            color: yellow;
            height: 2em;
            background: #660099;
            border-color: #ffffff;
            border-color: black;
            position: absolute;
            left:  50%;
            display: block;

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
    </style>
</head>
    <body>
        <form action="npcSubmit.php" method="POST">
        <p class="text">
            NPC Managment Page
        </p>
                
        <div class="text textTitle">Name :</div> <input type="text" name = "name" placeholder="Name" class="textBlock">
        <div class="text textTitle">Coordinates :</div> <input type="number" class="numScroll" placeholder="X" name="x"> <input type="number" class="numScroll" placeholder="Y" name="y"> <br>
        <div class="text textTitle">Character Type : </div> <input type="text" name = "character_type" placeholder="Character Type" class="textBlock">
        <div class="text textTitle">Interactions :</div> <input type="text" class="textBlock" placeholder="Interactions" name= "interactions">
        <div class="text textTitle">Direction :</div> <div class="text textTitle smaller">N :</div> <input type="radio" class="checkbox" name="direction" value='N'> <div class="text textTitle smaller">E :</div> <input type="radio" class="checkbox" name="direction" value='E'> <div class="text textTitle smaller">S :</div> <input type="radio" class="checkbox" name="direction" value='S'> <div class="text textTitle smaller">W :</div> <input type="radio" class="checkbox" name="direction" value='W'>

        <button type="submit" class = "submit">Submit</button>

        </form>
        <p id="inner_box_text">Edit Interactions page<br><a id="link" href="adminPage.php">Go</a></p>
    </body>
</html>