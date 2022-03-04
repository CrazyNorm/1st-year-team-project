<?php 

$sql = "SELECT * FROM npcs";

$pdo = new pdo("mysql:host=something;dbname=unilife","tempUsername","tempPass");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);

$stmt->setFetchMode(PDO::FETCH_ASSOC);

while ($row = $stmt->fetch()){
	echo ($row['npc_id'] . "|" . $row['name'] . "|" . $row['coords'] . "|" . $row['character'] . "|" $row['interactions'] . "\n");
}

?>