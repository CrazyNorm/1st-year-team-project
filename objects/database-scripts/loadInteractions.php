<?php 

$sql = "SELECT * FROM interactions";

$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=u49728rt","u49728rt","Y4A6pE28gEJqnBw");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);

$stmt->setFetchMode(PDO::FETCH_ASSOC);

while ($row = $stmt->fetch()){
	echo ($row['interaction_ id'] . "|" . $row['is_default'] . "|" . $row['dialog'] . "|" . $row['audio'] . "|" $row['stat_changes'] . "|" . $row['actions'] . "|" . $row["quest_requirements"]  . "|" . $row["interaction_requirements"] . "\n");
}

?>