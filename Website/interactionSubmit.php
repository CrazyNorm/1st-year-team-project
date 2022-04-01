<?php
if(basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    header('Location: homepage.html');
}

session_start();
include("connection.php");


if($_SERVER['REQUEST_METHOD'] == "POST"){
    $dialog = $_POST['dialog'];

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

    $actions = $_POST['actions'];
    if ($actions == "") {
        $actions = '{"actions":[]}';
    } else {
        $actions = '{"actions": [' . $actions .']}';
    }

    $statChanges = '{';
    if ($hunger != 0) {
        $statChanges .= '"hunger": '.$hunger.',';
    }
    if ($sleep != 0) {
        $statChanges .= '"sleep": '.$sleep.',';
    }
    if ($money != 0) {
        $statChanges .= '"money": '.$money.',';
    }
    if ($grades != 0) {
        $statChanges .= '"grades": '.$grades.',';
    }
    if ($socialLife != 0) {
        $statChanges .= ',"socialLife": '.$socialLife.',';
    }

    if (substr($statChanges,-1) == ',') {
        $statChanges = substr($statChanges,0,-1);
    }
    $statChanges .= '}';

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
    $audio = $_POST['audio'];

    if (isset($_POST['is_default']) && $_POST['is_default'] == "1") {
        $is_default = 1;
    } else {
        $is_default = 0;
    }
    

        //save data to database
    $SQL = "INSERT INTO interactions (dialog, statChanges, actions, quest_requirements, interaction_requirements, audio, is_default) values ('$dialog', '$statChanges', '$actions', '$quest_requirements', '$interaction_requirements', '$audio', '$is_default')";
    
    $result = mysqli_query($con, $SQL);
    if ($result) {
        $interationid = $con->insert_id;
        if (!empty($_POST['npc_list'])) {
            foreach ($_POST['npc_list'] as $npcid) {
                $sql = "SELECT interactions FROM NPC WHERE npc_id='$npcid'";
                $result = $con->query($sql);
                if ($result) {
                    $interactions = mysqli_fetch_assoc($result);
                    if (strlen($interactions['interactions']) > 20) {
                        $interactions = substr($interactions['interactions'],0,18) . '"' . $interationid . '", ' . substr($interactions['interactions'], 18,-1) . '}';
                    } else {
                        $interactions = substr($interactions['interactions'],0,18) . '"' . $interationid . '"' . substr($interactions['interactions'], 18,-1) . '}';
                    }
                    
                    $sql = "UPDATE NPC SET interactions='$interactions' WHERE npc_id='$npcid'";
                    $result = mysqli_query($con, $sql);
                    if (!$result) {
                        echo "Error: " . $sql . "<br>" . mysqli_error($con);     
                    }
                } else {
                    echo "Error: " . $sql . "<br>" . mysqli_error($con);  
                }
                
            }
        }
        header('Location: adminPage.php');
        echo "New record created successfully";

    } 
    else {
        echo "Error: " . $SQL . "<br>" . mysqli_error($con);  
    }
}

?>