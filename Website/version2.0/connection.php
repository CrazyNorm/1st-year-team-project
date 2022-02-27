<?php

$dbhost = "localhost";
$dbusername = "root";
$dbpassword = "876973145";
$dbname = "unilife";

if(!$con = mysqli_connect($dbhost,$dbusername,$dbpassword,$dbname)){
    die("can't connect to database");
}

