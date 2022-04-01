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
    <title>Admin Page (Interactions) </title>
    
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
<label>
    <form action="interactionSubmit.php" method="post">
        <p class="text">
            This is the Interaction managment page
        </p>
        <div class="tooltip text textTitle">NPC's : <span class="tooltiptext">Select all NPC's to add this interaction to</span></span></div>
         <?php   
        include("connection.php");
        $sql = 'SELECT npc_id, name FROM NPC';
        $result = $con->query($sql);
        foreach ($result as $row) {
            echo '<div class="text textTitle smaller">' . $row['npc_id'] . ':' . $row['name'] .  ': </div> <input type="checkbox" class="checkbox smaller" name= "npc_list[]" value="' . $row['npc_id'] . '">';
        }
        ?>
        <br>
        <div class="tooltip text textTitle">Dialog : <span class="tooltiptext">Simple Text that will be displayed at the start of the interaction</span></div> <input type="text" class="textBlock" placeholder="Dialog" name= "dialog">
        <div class="tooltip text textTitle">Stat Changes : <span class="tooltiptext">An integer for the stat to change by. (if left blank it is 0)</span></div> <input type="number" class="numScroll" placeholder="Hunger" name="hunger"> <input type="number" class="numScroll" placeholder="Fatigue" name="sleep"> <input type="number" class="numScroll" placeholder="Money" name="money"> <input type="number" class="numScroll" placeholder="Grades" name="grades"> <input type="number" class="numScroll" placeholder="Social Life" name="socialLife">
        <div class="tooltip text textTitle">Actions : <span class="tooltiptext">This is pretty much JS code. Please ask before putting anything in here</span></div> <input type="text" class="textBlock" placeholder="Actions" name= "actions">
        <div class="tooltip text textTitle">Quest Requirements : <span class="tooltiptext">List with commas between the quest ids. eg. 1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Quest Requirements" name= "quest_requirements">
        <div class="tooltip text textTitle">Interaction Requirements : <span class="tooltiptext">List with commas between the interaction ids. eg.1,2,3,4</span></div> <input type="text" class="textBlock" placeholder="Interaction Requirements" name= "interaction_requirements">
        <div class="tooltip text textTitle">Audio Path : <span class="tooltiptext">A path to the audio in the file</span></div> <input type="text" class="textBlock" placeholder="Audio" name= "audio">
        <div class="tooltip text textTitle">Default : <span class="tooltiptext">Select if you want this to be a default interaction(The position of this may need to be moved in the NPC Record, so that it has as high an index as possible)</span></div> <input type="checkbox" class="checkbox" name= "is_default" value="1">

        <br>
        
        <button type="submit" class= "submit">Submit</button>

    </form>
    <button onclick='location.href="adminPage2.php"' class="text textTitle">EDIT Quests page</button>
    <button onclick='location.href="adminPage3.php"' class="text textTitle">EDIT NPC page</button>
    <button onclick='location.href="GamePage.php"' class="text textTitle">START GAME</button>


</label>
</body>
</html>
