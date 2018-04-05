<?php
error_reporting(0);
require_once 'database.php';
if($_GET['sid']){
	$sql = "SELECT * FROM schedule WHERE sid = " . $_GET['sid'];
	$res = mysqli_query($link, $sql);
	$data = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
}elseif($_GET['date']){
	$sql = "SELECT * FROM schedule WHERE date = '" . $_GET['date'] . "' ORDER BY start_at ASC";
	$res = mysqli_query($link, $sql);
	$data = array();
	while($row = mysqli_fetch_assoc($res)){
		$data[] = $row;
	}
	mysqli_free_result($res);
}
mysqli_close($link);
echo json_encode($data);
exit;