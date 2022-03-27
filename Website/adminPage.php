<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page (Interactions) </title>
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
            position: absolute;
            height: 2em;
            background: #660099;
            border-color: #ffffff;
            left : 50%;
            transform: translateX(-50%);
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
            
    </style>
        }
</head>
<body>
<label>
    <form action="interactionSubmit.php" method="post">
        <p class="text">
            This is the Interaction managment page
        </p>
        <div class="text textTitle">Dialog :</div> <input type="text" class="textBlock" placeholder="Dialog" name= "dialog">
        <div class="text textTitle">Stat Changes :</div> <input type="number" class="numScroll" placeholder="Hunger" name="hunger"> <input type="number" class="numScroll" placeholder="Fatigue" name="sleep"> <input type="number" class="numScroll" placeholder="Money" name="money"> <input type="number" class="numScroll" placeholder="Grades" name="grades"> <input type="number" class="numScroll" placeholder="Social Life" name="socialLife">
        <div class="text textTitle">Actions : </div> <input type="text" class="textBlock" placeholder="Actions" name= "actions">
        <div class="text textTitle">Quest Requirements :</div> <input type="text" class="textBlock" placeholder="Quest Requirements" name= "quest_requirements">
        <div class="text textTitle">Interaction Requirements :</div> <input type="text" class="textBlock" placeholder="Interaction Requirements" name= "interaction_requirements">
        <div class="text textTitle">Audio Path :</div> <input type="text" class="textBlock" placeholder="Audio" name= "audio">
        <div class="text textTitle">Default :</div> <input type="checkbox" class="checkbox" name= "is_default" value="1">
        <br>

        <?php
        session_start();
        include("connection.php");
        $sql = 'SELECT npc_id, name FROM NPC';
        $result = $con->query($sql);
        foreach ($result as $row) {
            echo '<div class="text textTitle smaller">' . $row['npc_id'] . ':' . $row['name'] .  ': </div> <input type="checkbox" class="checkbox smaller" name= "npc_list[]" value="' . $row['npc_id'] . '">';
        }
        ?>
        <button type="submit" class= "submit">Submit</button>

    </form>
    <button onclick='location.href="adminPage2.php"' class="text textTitle">EDIT Quests page</button>
    <button onclick='location.href="adminPage2.php"' class="text textTitle">EDIT Quests page</button>


</label>
</body>
</html>
