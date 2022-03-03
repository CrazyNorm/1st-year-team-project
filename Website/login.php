<?php include('server.php') ?>
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
        <p><label for="Username"></label><input type="text" id="Username" placeholder="Username" class="text_block" name="username" required></p>
        <p><label for="Password"></label><input type="password" id="user_password" placeholder="Password" class="text_block" name="password" required></p>
        <p><label>
                <input type="checkbox" onclick="showPassword()">
            </label>Show Password</p>
        <div id="login_and_link">
            <button id="login_btn" name="login_btn">Sign up</button>
            <p id="inner_box_text">Not got an account?<br><a id="link" href="register.php">Sign up</a></p>
        </div>
    </form>
</div>
</body>
</html>