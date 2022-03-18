<?php
session_start();
include("connection.php");


if($_SERVER['REQUEST_METHOD'] == "POST"){
    $dialog = $_POST['dialog'];
    $statChanges = $_POST['statChanges'];
    $actions = $_POST['actions'];
    $quest_requirements = $_POST['quest_requirements'];
    $interaction_requirements = $_POST['interaction_requirements'];
    $audio = $_POST['audio'];
    $is_default = $_POST['is_default'];

        //save data to database
    $SQL = "INSERT INTO interactions (dialog, statChanges, actions, quest_requirements, interaction_requirements, audio, is_default) values ('$dialog', '$statChanges', '$actions', '$quest_requirements', '$interaction_requirements', '$audio', '$is_default')";


    
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
    <title>Admin Page (Interactions) </title>
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
    <link rel="stylesheet" type="text/css" href="website_style.css">
</head>
<body>
<label>
    <form action="adminPage.php" method="post">
        <p class="text">
            This is the Interaction managment page
        </p>
        <input type="text" class="text_block" placeholder="dialog" name= "dialog">
        <input type="text" class="text_block" placeholder="statChanges" name= "statChanges">
        <input type="text" class="text_block" placeholder="actions" name= "actions">
        <input type="text" class="text_block" placeholder="quest_requirements" name= "quest_requirements">
        <input type="text" class="text_block" placeholder="interaction_requirements" name= "interaction_requirements">
        <input type="text" class="text_block" placeholder="audio" name= "audio">
        <input type="number" class="text_block" placeholder="is_default" name= "is_default">
        <button type="submit" class= "submit">Submit</button>

    </form>
    <p id="inner_box_text">EDIT Quests page <br><a id="link" href="adminPage2.php">Go</a></p>

</label>
</body>
</html>
