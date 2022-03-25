<?php
session_start();

include("connection.php");


//Quests Table
if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $title = $_POST['title'];
    $description = $_POST['description'];
    $targetCount = $_POST['targetCount'];
    $completed_quests = $_POST['completed_quests'];
    $rewardActions = $_POST['rewardActions'];
    $rewardStatChanges = $_POST['rewardStatChanges'];
    $quest_requirements = $_POST['quest_requirements'];
    $interationRequirements = $_POST['interationRequirements'];
    $updated_by_quest = $_POST['rewardStatChanges'];
    $updated_by_interaction = $_POST['updated_by_interaction'];

    // Table insert
    $SQL = "INSERT INTO quest (title, description, targetCount, completed_quests, rewardActions, rewardStatChanges, quest_requirements, interationRequirements, updated_by_quest, updated_by_interaction) VALUES ('$title', '$description', '$targetCount', 
    '$completed_quests', '$rewardActions', '$rewardStatChanges', '$quest_requirements', '$interationRequirements', '$updated_by_quest', 
    '$updated_by_interaction')";

    $result = mysqli_query($con, $SQL);

    if ($result){
            echo "New record created successfully";

    } 
    else {
         echo "Error: " . $SQL . "<br>" . mysqli_error($con);  
    }


}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page (Quest) </title>
        <style type="text/css">
            .text {
            font-family: "Helvetica";
            color: Black;
            font-size: 30px;
            line-height: 1;
            text-align: center;
            background: white;
            }

            .submit {
            width:  120px;
            height: 40px;
            background: #660099;
            color: #ffffff;
            border-color: #ffffff;
            }
            
        </style>
        <link rel="stylesheet" type="text/css" href="resources/css/website_style.css">
</head>
    <body>
        <form action="adminPage2.php" method="POST">
        <p class="text">
            This is the Quest managment page
        </p>
                
                    <input type="text" name = "title" placeholder="title" class="text_block">
                    <input type="text" name = "description" placeholder="description" class="text_block">
                    <input type="number" name = "targetCount" placeholder="targetCount" class="text_block">
                    <input type="text" name = "completed_quests" placeholder="completed_quests" class="text_block">
                    <input type="text" name = "rewardActions" placeholder="rewardActions" class="text_block">
                    <input type="text" name = "rewardStatChanges" placeholder="rewardStatChanges" class="text_block">
                    <input type="text" name = "quest_requirements" placeholder="quest_requirements" class="text_block">
                    <input type="text" name = "interationRequirements" placeholder="interationRequirements" class="text_block">
                    <input type="text" name = "updated_by_quest" placeholder="updated_by_quest" class="text_block">
                    <input type="text" name = "updated_by_interaction" placeholder="updated_by_interaction" class="text_block">
            
                    <button type="submit" class = "submit">Submit</button>

        </form>
        <p id="inner_box_text">Edit Interactions page<br><a id="link" href="adminPage.php">Go</a></p>
    </body>
</html>