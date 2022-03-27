<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page (Quest) </title>
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
            
    </style>
</head>
    <body>
        <form action="questSubmit.php" method="POST">
        <p class="text">
            This is the Quest managment page
        </p>
                
        <div class="text textTitle">Title :</div> <input type="text" name = "title" placeholder="Title" class="textBlock">
        <div class="text textTitle">Description :</div> <input type="text" name = "description" placeholder="Description" class="textBlock">
        <div class="text textTitle">Target Count :</div> <input type="number" name = "targetCount" placeholder="Target Count" class="textBlock">
        <div class="text textTitle">Stat Changes :</div> <input type="number" class="numScroll" placeholder="Hunger" name="hunger"> <input type="number" class="numScroll" placeholder="Fatigue" name="sleep"> <input type="number" class="numScroll" placeholder="Money" name="money"> <input type="number" class="numScroll" placeholder="Grades" name="grades"> <input type="number" class="numScroll" placeholder="Social Life" name="socialLife">
        <div class="text textTitle">Actions : </div> <input type="text" name = "rewardActions" placeholder="Reward Actions" class="textBlock">
        <div class="text textTitle">Quest Requirements :</div> <input type="text" class="textBlock" placeholder="Quest Requirements" name= "quest_requirements">
        <div class="text textTitle">Interaction Requirements :</div> <input type="text" class="textBlock" placeholder="Interaction Requirements" name= "interaction_requirements">
        <div class="text textTitle">Updated by Quests :</div> <input type="text" class="textBlock" placeholder="Updated by Quests" name= "updated_by_quests">
        <div class="text textTitle">Updated by Interactions :</div> <input type="text" class="textBlock" placeholder="Updated by Interactions" name= "updated_by_interactions">

        <button type="submit" class = "submit">Submit</button>

        </form>
        <p id="inner_box_text">Edit Interactions page<br><a id="link" href="adminPage.php">Go</a></p>
    </body>
</html>