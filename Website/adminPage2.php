<?php
session_start();
include("connection.php");
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
    $query = "insert into quest (title, description, targetCount, completed_quests, rewardActions, rewardStatChanges, quest_requirements, interationRequirements, updated_by_quest, updated_by_interaction) values ('$title', '$description', '$targetCount', '$completed_quests', '$rewardActions', '$rewardStatChanges', '$quest_requirements', '$interationRequirements', '$updated_by_quest', '$updated_by_interaction')";
}
?>


<!DOCTYPE html>
<html lang="en">
<body>
<form action="adminPage2.php" method="post">
    <p><p><p><p><p>
        <label><input type="text" placeholder="title" class="text_block">
            <input type="text" placeholder="description" class="text_block">
            <input type="number" placeholder="targetCount" class="text_block">
            <input type="text" placeholder="completed_quests" class="text_block">
            <input type="text" placeholder="rewardActions" class="text_block">
            <input type="text" placeholder="rewardStatChanges" class="text_block">
            <input type="text" placeholder="quest_requirements" class="text_block">
            <input type="text" placeholder="interationRequirements" class="text_block">
            <input type="text" placeholder="updated_by_quest" class="text_block">
            <input type="text" placeholder="updated_by_interaction" class="text_block"></label>
            <button type="submit">Submit</button>

</form>
</body>

</html>
