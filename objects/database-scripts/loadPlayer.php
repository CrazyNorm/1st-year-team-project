<?php 

$player_id = $_GET["player_id"];

$sql = "SELECT * FROM player_data WHERE user_id = :player_id";

$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=u49728rt","u49728rt","Y4A6pE28gEJqnBw");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);
$stmt->execute([
			'player_id' => $player_id
			]);

$stmt->setFetchMode(PDO::FETCH_ASSOC);

while ($row = $stmt->fetch()){
	echo ($row['coords'] . "|" . $row['character_type'] . "|" . $row['stats'] . "|" . $row['current_quest'] . "|" . $row["selected_quest"]  . "|" . $row["completed_interactions"] . "|" . $row["completed_quests"] . "|" . $row["quest_counts"] . "|" . $row["time_of_day"] . "\n");
}

?>