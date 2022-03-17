<?php
session_start();
include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD' == "POST"]){
    $dialog = $_POST['dialog'];
    $statChanges = $_POST['statChanges'];
    $actions = $_POST['actions'];
    $quest_requirements = $_POST['quest_requirements'];
    $interaction_requirements = $_POST['interaction_requirements'];
    $audio = $_POST['audio'];
    $is_default = $_POST['is_default'];

    if(!empty($dialog) ){
        //save data to database
        $query = "insert into interactions (dialog, statChanges, actions, quest_requirements, interaction_requirements, audio, is_default) values ('$dialog', '$statChanges', '$actions', '$quest_requirements', '$interaction_requirements', '$audio', '$is_default')";
        mysqli_query($con, $query);

        header("Location:adminPage.php");

    }
}


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Page</title>
    <link rel="stylesheet" type="text/css" href="website_style.css">
</head>
<body>
<label>
    <form action="adminPage.php" method="post">
        <input type="text" class="text_block" placeholder="dialog">
        <input type="text" class="text_block" placeholder="statChanges">
        <input type="text" class="text_block" placeholder="actions">
        <input type="text" class="text_block" placeholder="quest_requirements">
        <input type="text" class="text_block" placeholder="interaction_requirements">
        <input type="text" class="text_block" placeholder="audio">
        <input type="number" class="text_block" placeholder="is_default">
        <button type="submit">Submit</button>

    </form>
    <p id="inner_box_text">Admin Page 2<br><a id="link" href="adminPage2.php">GO</a></p>

</label>
</body>
</html>
