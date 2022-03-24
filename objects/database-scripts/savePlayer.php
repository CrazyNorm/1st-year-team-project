<?php 

$player_id = $_GET["player_id"];
$coords = $_GET["coords"];
$character_type = $_GET["character_type"];
$stats = $_GET["stats"];
$current_quests = $_GET["current_quests"];
$selected_quest = $_GET["selected_quest"];
$completed_interactions = $_GET["completed_interactions"];
$completed_quests = $_GET["completed_quests"];
$quest_counts = $_GET["quest_counts"];
$time_of_day = $_GET["time_of_day"];

$sql = "UPDATE player_data 
		SET coords = :coords,
			character_type = :character_type,
			stats = :stats,
			current_quests = :current_quests,
			selected_quest = :selected_quest,
			completed_interactions = :completed_interactions,
			completed_quests = :completed_quests,
			quest_counts = :quest_counts,
			time_of_day = :time_of_day
		WHERE player_id = :player_id";

$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=u49728rt","u49728rt","Y4A6pE28gEJqnBw");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);
$stmt->execute([
			'coords' => $coords,
			'character_type' => $character_type,
			'stats' => $stats,
			'current_quests' => $current_quests,
			'selected_quest' => $selected_quest,
			'completed_interactions' => $completed_interactions,
			'completed_quests' => $completed_quests,
			'quest_counts' => $quest_counts,
			'time_of_day' => $time_of_day,
			'player_id' => $player_id
			]);

?>