<?php
session_start();
include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $unsafe_email = $_POST['email']; 
    $email = mysqli_real_escape_string($con, $unsafe_email);  //prevent injection
    $unsafe_password = $_POST['password'];
    $password = mysqli_real_escape_string($con, $unsafe_password);  //prevent injection

    $email = $_POST['email'];
    $password = $_POST['password'];

    if(!empty($email) && !empty($password)){
        //read data from database
        $query = "SELECT * FROM user WHERE email = '$email' LIMIT 1";

        $result = mysqli_query($con, $query);

        if($result){
            if($result && mysqli_num_rows($result) > 0){
                $user_data = mysqli_fetch_assoc($result);

                if(password_verify($password, $user_data['password'])) {
                    $_SESSION['userid'] = $user_data['id'];

                    if($user_data['is_admin'] == 1){
                        $_SESSION['is_admin'] = $user_data['is_admin'];
                        header("Location: adminPage.php");
                    }
                    else{
                        header("Location: GamePage.php");
                    }
                    die;
                }
            }
        }
        echo "Email or password is incorrect";
    }
    else{
        echo "Username and password are required";
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UniLife Login</title>
    <link rel="shortcut icon" type="image/png" href="resources/imgs/icon.png"/>
    <link rel="stylesheet" type="text/css" href="resources/css/website_style.css">
</head>
<body>
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
<div style="position: absolute;min-width: 100vw; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
<div id="login_block">
    <form action="login.php" method="POST">
        <p><label for="Username"></label><input type="email" id="Email" placeholder="Email" class="text_block" name="email" required></p>
        <p><label for="Password"></label><input type="password" id="user_password" placeholder="Password" class="text_block" name="password" required></p>
        <h2 class="login-title">
            <p><label>
                    <input type="checkbox" onclick="showPassword()">
                </label>Show Password</p>
            <span>New user?</span><a href="register.php">Create an account</a>
        </h2>

        <div id="login_and_link">
            <button id="login_btn" name="login_btn">Sign in</button>
        </div>
    </form>
</div>
</div>
</body>
</html>
