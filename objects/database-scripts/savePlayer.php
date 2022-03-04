<?php 

$player_id = $_GET["player_id"];
$coords = $_GET["coords"];
$character = $_GET["character"];
$stats = $_GET["stats"];
$current_quest = $_GET["current_quest"];
$selected_quest = $_GET["selected_quest"];
$completed_interactions = $_GET["completed_interactions"];
$completed_quests = $_GET["completed_quests"];
$quest_counts = $_GET["quest_counts"];
$time_of_day = $_GET["time_of_day"];

$sql = "UPDATE player 
		SET coords = :coords,
			character = :character,
			stats = :stats,
			current_quest = :current_quest,
			selected_quest = :selected_quest,
			completed_interactions = :completed_interactions,
			completed_quests = :completed_quests,
			quest_counts = :quest_counts,
			time_of_day = :time_of_day
		WHERE user_id = :player_id";

$pdo = new pdo("mysql:host=something;dbname=unilife","tempUsername","tempPass");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);
$stmt->execute([
			'coords' => $coords,
			'character' => $character,
			'stats' => $stats,
			'current_quest' => $current_quest,
			'selected_quest' => $selected_quest,
			'completed_interactions' => $completed_interactions,
			'quest_counts' => $quest_counts,
			'time_of_day' => $time_of_day,
			'player_id' => $player_id,
			]);

?>