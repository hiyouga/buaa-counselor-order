<?php
error_reporting(0);
require_once 'database.php';
$sql = "SELECT * FROM schedule WHERE date = '" . $_GET['date'] . "' ORDER BY start_at ASC";
$data = array();
while($row = mysqli_fetch_assoc($res)){
	$data[] = $row;
}
mysqli_free_result($res);
mysqli_close($link);
echo json_encode($data);
exit;