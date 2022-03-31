<?php
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    header('Location: ../../homepage.html');
}

$player_id = $_GET["player_id"];

$sql = "SELECT * FROM player_data WHERE userid = :player_id";

$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=2021_comp10120_y12","v80015aa","12345678");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);
$stmt->execute([
			'player_id' => $player_id
			]);

$stmt->setFetchMode(PDO::FETCH_ASSOC);

$row = $stmt->fetch();
echo ($row['coords'] . "|" . $row['character_type'] . "|" . $row['stats'] . "|" . $row['currentQuests'] . "|" . $row["selectedQuest"]  . "|" . $row["completedInteractions"] . "|" . $row["completedQuests"] . "|" . $row["questCounts"] . "|" . $row["timeOfDay"]);

?>