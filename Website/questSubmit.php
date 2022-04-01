<?php
if(basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    header('Location: homepage.html');
}

session_start();

include("connection.php");


//Quests Table
if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $title = $_POST['title'];
    $description = $_POST['description'];
    $targetCount = $_POST['targetCount'];
    if ($targetCount == '') {
        $targetCount = 0;
    }
    $hunger = $_POST['hunger'];
    if ($hunger == '') {
        $hunger = 0;
    }
    $sleep = $_POST['sleep'];
    if ($sleep == '') {
        $sleep = 0;
    }
    $money = $_POST['money'];
    if ($money == '') {
        $money = 0;
    }
    $grades = $_POST['grades'];
    if ($grades == '') {
        $grades = 0;
    }
    $socialLife = $_POST['socialLife'];
    if ($socialLife == '') {
        $socialLife = 0;
    }

    $rewardActions = $_POST['rewardActions'];
    if ($rewardActions = "") {
        $rewardActions = '{"actions":[]}';
    } else {
        $rewardActions = '{"actions": [' . $rewardActions .']}';
    }


    $rewardStatChanges = '{';
    if ($hunger != 0) {
        $rewardStatChanges .= '"hunger": '.$hunger.',';
    }
    if ($sleep != 0) {
        $rewardStatChanges .= '"sleep": '.$sleep.',';
    }
    if ($money != 0) {
        $rewardStatChanges .= '"money": '.$money.',';
    }
    if ($grades != 0) {
        $rewardStatChanges .= '"grades": '.$grades.',';
    }
    if ($socialLife != 0) {
        $rewardStatChanges .= ',"socialLife": '.$socialLife.',';
    }

    if (substr($rewardStatChanges,-1) == ',') {
        $rewardStatChanges = substr($rewardStatChanges,0,-1);
    }
    $rewardStatChanges .= '}';

    $quest_requirements = $_POST['quest_requirements'];
    if ($quest_requirements == "") {
        $quest_requirements = '{"requirements": []}';
    } else {
        $quests = explode(',', $quest_requirements);
        $tempstr = '';
        foreach ($quests as $q) {
            $tempstr .= '"' . $q . '"' . ',';
        }
        $quest_requirements = '{"requirements": ['. substr($tempstr, 0,-1) . ']}';
    }

    $interaction_requirements = $_POST['interaction_requirements'];
    if ($interaction_requirements == "") {
        $interaction_requirements = '{"requirements": []}';
    } else {
        $quests = explode(',', $interaction_requirements);
        $tempstr = '';
        foreach ($quests as $q) {
            $tempstr .= '"' . $q . '"' . ',';
        }
        $interaction_requirements = '{"requirements": ['. substr($tempstr, 0,-1) . ']}';
    }

    $updated_by_quests = $_POST['updated_by_quests'];
    if ($updated_by_quests == "") {
        $updated_by_quests = '{"quests": []}';
    } else {
        $quests = explode(',', $updated_by_quests);
        $tempstr = '';
        foreach ($quests as $q) {
            $tempstr .= '"' . $q . '"' . ',';
        }
        $updated_by_quests = '{"quests": ['. substr($tempstr, 0,-1) . ']}';
    }

    $updated_by_interactions = $_POST['updated_by_interactions'];
    if ($updated_by_interactions == "") {
        $updated_by_interactions = '{"interactions": []}';
    } else {
        $interactions = explode(',', $updated_by_interactions);
        $tempstr = '';
        foreach ($interactions as $q) {
            $tempstr .= '"' . $q . '"' . ',';
        }
        $updated_by_interactions = '{"interactions": ['. substr($tempstr, 0,-1) . ']}';
    }    

    // Table insert
    $SQL = "INSERT INTO quest (title, description, targetCount, rewardActions, rewardStatChanges, quest_requirements, interationRequirements, updated_by_quest, updated_by_interaction) VALUES ('$title', '$description', '$targetCount', '$rewardActions', '$rewardStatChanges', '$quest_requirements', '$interaction_requirements', '$updated_by_quests', '$updated_by_interactions')";

    $result = mysqli_query($con, $SQL);

    if ($result){
        header('Location: adminPage2.php');
        echo "New record created successfully";

    } 
    else {
         echo "Error: " . $SQL . "<br>" . mysqli_error($con);  
    }

}
?>