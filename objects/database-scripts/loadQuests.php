<?php 

$sql = "SELECT * FROM quests";

$pdo = new pdo("mysql:host=something;dbname=unilife","tempUsername","tempPass");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);

$stmt->setFetchMode(PDO::FETCH_ASSOC);

while ($row = $stmt->fetch()){
	echo ($row['quest_id'] . "|" . $row['title'] . "|" . $row['description'] . "|" . $row['target_count'] . "|" . $row["reward_stat_changes"]  . "|" . $row["reward_actions"] . "|" . $row["quest_requirements"] . "|" . $row["interaction_requirements"] . "|" . $row["updated_by_quests"] . "|" . $row["updated_by_interactions"] . "\n");
}

?>