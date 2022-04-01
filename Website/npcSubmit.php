<?php
if(basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    header('Location: homepage.html');
}

session_start();

include("connection.php");


//Quests Table
if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $name = $_POST['name'];
    $x = $_POST['x'];
    if ($x == '') {
        $x = 0;
    }
    $y = $_POST['y'];
    if ($y == '') {
        $y = 0;
    }

    $character_type = $_POST['character_type'];
    if ($character_type == '') {
        $character_type = 'Blank';
    } 


    $coords = '{"x": '.$x.',"y": '.$y.'}';

    $interactions = $_POST['interactions'];
    if ($interactions == "") {
        $interactions = '{"interactions": []}';
    } else {
        $quests = explode(',', $interactions);
        $tempstr = '';
        foreach ($quests as $q) {
            $tempstr .= '"' . $q . '"' . ',';
        }
        $interactions = '{"interactions": ['. substr($tempstr, 0,-1) . ']}';
    }

    
    if (!isset($_POST['direction'])) {
        $direction = 'S';
    } else {
        $direction = $_POST['direction'];
    }

    // Table insert
    $SQL = "INSERT INTO NPC (name, coords, character_type, interactions, direction) VALUES ('$name', '$coords', '$character_type', '$interactions', '$direction')";

    $result = mysqli_query($con, $SQL);

    if ($result){
        header('Location: adminPage3.php');
        echo "New record created successfully";

    } 
    else {
        echo "Error: " . $SQL . "<br>" . mysqli_error($con);  
    }


}
?>