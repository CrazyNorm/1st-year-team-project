<?php
session_start();
include("connection.php");
#include("functions.php");
//Quests Table

if($_SERVER['REQUEST_METHOD' == "POST"]){
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
    $query = "INSERT INTO quest (title, description, targetCount, completed_quests, rewardActions, rewardStatChanges, quest_requirements, interationRequirements, updated_by_quest, updated_by_interaction) VALUES ('$title', '$description', '$targetCount', 
    '$completed_quests', '$rewardActions', '$rewardStatChanges', '$quest_requirements', '$interationRequirements', '$updated_by_quest', 
    '$updated_by_interaction')";

    mysqli_query($con, $query);
    header("Location:adminPage2.php");
}
?>


<!DOCTYPE html>
<html lang="en">
    <body>
        <form action="adminPage2.php" method="POST">
            <p><p><p><p><p>
                <label><input type="text" name = "title" placeholder="title" class="text_block">
                    <input type="text" name = "description" placeholder="description" class="text_block">
                    <input type="number" name = "targetCount" placeholder="targetCount" class="text_block">
                    <input type="text" name = "completed_quests" placeholder="completed_quests" class="text_block">
                    <input type="text" name = "rewardActions" placeholder="rewardActions" class="text_block">
                    <input type="text" name = "rewardStatChanges" placeholder="rewardStatChanges" class="text_block">
                    <input type="text" name = "quest_requirements" placeholder="quest_requirements" class="text_block">
                    <input type="text" name = "interationRequirements" placeholder="interationRequirements" class="text_block">
                    <input type="text" name = "updated_by_quest" placeholder="updated_by_quest" class="text_block">
                    <input type="text" name = "updated_by_interaction" placeholder="updated_by_interaction" class="text_block"></label>
                    <button type="submit">Submit</button>

        </form>
    </body>
</html>