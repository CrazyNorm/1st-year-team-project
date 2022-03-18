<?php
session_start();
include("connection.php");
include("functions.php");

if($_SERVER['REQUEST_METHOD'] == "POST")
{
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $is_admin = 0;

    if(!empty($username) && !empty($password)){
        //save data to database
        $query = "insert into user (email, username, password, is_admin) values ('$email', '$username', '$password', '$is_admin')";
    }

        mysqli_query($con, $query);
        header("Location:login.php");

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
    <form action="register.php" method="post">
        <p><label for="Email"></label><input type="email" id="Email" placeholder="Email" class="text_block" name = "email" required></p>
        <p><label for="Username"></label><input type="text" id="Username" placeholder="Username" class="text_block" name = "username" required></p>
        <p><label for="Password"></label><input type="password" id="user_password" placeholder="Password" class="text_block" name = "password" required></p>
        <p><label>
                <input type="checkbox" onclick="showPassword()">
            </label>Show Password</p>
        <div id="login_and_link">
            <button type="submit" id="login_btn" name="register_btn">Sign up</button>
            <p id="inner_box_text">Already got an account?<br><a id="link" href="login.php">Sign in</a></p>
        </div>
    </form>
</div>
</body>
</html>
