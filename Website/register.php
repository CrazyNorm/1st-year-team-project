<?php
session_start();
include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    //$uername = mysqli_real_escape_string($con, $unsafe_username);  //prevent injection
    //$password = mysqli_real_escape_string($con, $unsafe_password);  //prevent injection
    $password = password_hash($password, PASSWORD_DEFAULT);
    $is_admin = 0;
    $score = 0;

    $userid;
    $coords = '{"x":37,"y":69}';
    if (isset($_POST['character_type'])) {
        $character_type = $_POST['character_type'];
    } else {
        $character_type = '';
    }
    $stats = '{"money":50,"sleep":0,"grades":0,"hunger":15,"socialLife":0}';
    $current_quests = '{"quests":["0"]}';
    $selected_quest = 0;
    $completed_interactions = '{"interactions":[]}';
    $completed_quests = '{"quests":[]}';
    $quest_counts = '{"0":0}';
    $time_of_day = 0;

    if(!empty($username) && !empty($password) && !empty($character_type)){
        //save data to database
        $sql = "INSERT INTO user (email, username, password, is_admin, score) values (:email, :username, :password, :is_admin, :score)";
        $preparedStatement = $pdo->prepare($sql);

        $preparedStatement->execute([   'email' =>      $email,
                                        'username' =>   $username,
                                        'password' =>   $password,
                                        'is_admin' =>   $is_admin,
                                        'score' =>      $score]);

        $last_id = $pdo->lastInsertId();
        $sql = "INSERT INTO player_data (userid, coords, character_type, stats, currentQuests, selectedQuest, completedInteractions, completedQuests, questCounts, timeOfDay) values (:userid, :coords, :character_type, :stats, :current_quests, :selected_quest, :completed_interactions, :completed_quests, :quest_counts, :time_of_day)";

        $preparedStatement = $pdo->prepare($sql);

        $preparedStatement->execute([   
                                        'userid' =>     $last_id,
                                        'coords' =>     $coords,
                                        'character_type' =>     $character_type,
                                        'stats' =>     $stats,
                                        'current_quests' =>     $current_quests,
                                        'selected_quest' =>     $selected_quest,
                                        'completed_interactions' =>     $completed_interactions,
                                        'completed_quests' =>     $completed_quests,
                                        'quest_counts' =>     $quest_counts,
                                        'time_of_day' =>     $time_of_day]);

        header("Location:login.php");

    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UniLife Register</title>
    <link rel="shortcut icon" type="image/png" href="resources/imgs/icon.png"/>
    <link rel="stylesheet" type="text/css" href="resources/css/website_style.css">
    <style type="text/css">
        /* Customize the label (the container) */
        /* The container */
        .container {
            display: inline-block;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Hide the browser's default radio button */
        .container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        /* Create a custom radio button */
        .checkmark {
          background-color: #eee;
          border: solid 5px;
          border-radius: 10px;
        }

        /* On mouse-over, add a grey background color */
        .container:hover input ~ .checkmark {
          background-color: #ccc;
        }

        /* When the radio button is checked, add a blue background */
        .container input:checked ~ .checkmark {
          background-color: #2196F3;
        }

        /* Create the indicator (the dot/circle - hidden when not checked) */
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        /* Show the indicator (dot/circle) when checked */
        .container input:checked ~ .checkmark:after {
          display: inline-block;
        }

        /* Style the indicator (dot/circle) */
        .container .checkmark:after {
            background: white;
        }

    </style>

</head>
<body style="min-height: 100vh; overflow-x: hidden;">
<script>
    function showPassword() {
        let a = document.getElementById("user_password");
        if (a.type === "password") {
            a.type = "text";
        }
        else {
            a.type = "password";
        }
    }
</script>
<div style="position: absolute; width: 100%; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
<div id="login_block" style="">
    <form action="register.php" method="post">
        <p><label for="Email"></label><input type="email" id="Email" placeholder="Email" class="text_block" name = "email" required></p>
        <p><label for="Username"></label><input type="text" id="Username" placeholder="Username" class="text_block" name = "username" required></p>
        <p><label for="Password"></label><input type="password" id="user_password" placeholder="Password" class="text_block" name = "password" required></p>
        <p style=" font-family: 'Roboto Medium', sans-serif; font-size: 1.5em; color:#59c2c5">Player character:</p>
        <div>
            <label class="container">
                <input type="radio" class="imgButton" name="character_type" value="Player_Brown_Hair" required>
                <div class="checkmark" style="">
                <img src="resources/imgs/characters/Player_Brown_Hair/S_Standing.png" style="width:15vw; height:15vw;">    
                </div>
            </label>
            <label class="container">
                 <input type="radio" class="imgButton" name="character_type" value="Female_Gareth">
                 <div class="checkmark">
                    <img src="resources/imgs/characters/Female_Gareth/S_Standing.png" style="width:15vw; height: 15vw;">
                </div>
            </label>
        </div>

        <h2 class="login-title">
            <p><label>
                    <input type="checkbox" onclick="showPassword()">
                </label>Show Password
            </p>
            <span>Already have an account? </span><a href="login.php">Sign in</a>
        </h2>
        <div id="login">
            <button type="submit" id="login_btn" name="register_btn">Sign up</button>
        </div>
    </form>
</div>
</div>
</body>
</html>

