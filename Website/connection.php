<?php

#$dbhost = "localhost";
#$dbusername = "root";
#$dbpassword = "876973145";
#$dbname = "unilife";

$dbhost = "dbhost.cs.man.ac.uk";
$dbusername = "v80015aa";
$dbpassword = "12345678";
#$dbname = "v80015aa";
$dbname = array("2021_comp10120_y12",);



if(!$con = mysqli_connect($dbhost,$dbusername,$dbpassword,$dbname)){
    die("can't connect to database");
}




