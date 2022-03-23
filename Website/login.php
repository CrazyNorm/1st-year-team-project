<?php
session_start();
include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $unsafe_email = $_POST['email']; 
    $email = mysqli_real_escape_string($unsafe_email);  //prevent injection
    $unsafe_password = $_POST['password'];
    $password = mysqli_real_escape_string($unsafe_password);  //prevent injection


    if(!empty($email) && !empty($password)){
        //read data from database
        $query = "select * from user where email = '$email' limit 1";

        $result = mysqli_query($con, $query);

        if($result){
            if($result && mysqli_num_rows($result) > 0){
                $user_data = mysqli_fetch_assoc($result);

                if($user_data['password'] == $password){
                    $_SESSION['email'] = $user_data['email'];

                    if ($user_data['is_admin'] == '1'){
                        header("Location: adminPage.php");
                        die;
                    }
                    else {
                        header("Location: GamePage.html");
                        die;
                    }
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
    <title>Register page</title>

    <link rel="stylesheet" type="text/css" href="website_style.css">
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
</body>
</html>
