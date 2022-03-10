<?php 

$sql = "SELECT * FROM interactions";

$pdo = new pdo("mysql:host=dbhost.cs.man.ac.uk;dbname=u49728rt","u49728rt","Y4A6pE28gEJqnBw");

$pdo->setAttribute(PDO::ATTR_ERRMODE,
				   PDO::ERRMODE_WARNING);

$stmt = $pdo->prepare($sql);
$stmt->execute();

$stmt->setFetchMode(PDO::FETCH_ASSOC);

$rows = $stmt->fetchAll();

foreach ($rows as $row) {
	echo (implode ("|", $row) . "\n");
}

?>