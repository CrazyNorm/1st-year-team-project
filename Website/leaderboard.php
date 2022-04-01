<!doctype html>
   <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Leaderboard</title>
			
			<link rel="shortcut icon" type="image/png" href="resources/imgs/icon.png"/>
            <link rel="stylesheet" type="text/css" href="resources/css/leaderboard_style.css">
		</head>
 <body>
        <div class="leaderboard">
            <h1>
                Leaderboard Top 5 Players
            </h1>
            <ol>
            	<?php
					include("connection.php");

					$result = mysqli_query($con, "SELECT username, score FROM user ORDER BY score DESC LIMIT 5");

					  
					/* Fetch Rows from the SQL query */
					if (mysqli_num_rows($result)) {
					    while ($row = mysqli_fetch_array($result)) {
					        echo "
					        <li>
					        <user>{$row['username']}</user>
					        <score>{$row['score']}</score>
					        </li>";
					        
					    }
					}
				?>
            </ol>
        </div>

    </body>
</html>



