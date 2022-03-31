<?php
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    header('Location: ../../homepage.html');
}
else {
	$user_id = $_GET["user_id"];
	$score = $_GET["score"];

	$sql = "UPDATE user 
			SET score = :score
			WHERE id = :user_id";

	$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=2021_comp10120_y12","v80015aa","12345678");

	$pdo->setAttribute(PDO::ATTR_ERRMODE,
					   PDO::ERRMODE_WARNING);

	$stmt = $pdo->prepare($sql);
	$stmt->execute([
				'score' => $score,
				'user_id' => $user_id
				]);
}
?>