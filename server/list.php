<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
$data = array();
if ($_GET['type'] == 'selectBySid') {
	$sql = "SELECT * FROM schedule WHERE sid = " . $_GET['sid'];
	$res = mysqli_query($link, $sql);
	$data = mysqli_fetch_assoc($res);
} elseif ($_GET['type'] == 'selectByDate') {
	$sql = "SELECT * FROM schedule WHERE date = '" . $_GET['date'] . "' ORDER BY start_at ASC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
} elseif ($_GET['type'] == 'selectByUid') {
	$sql = "SELECT sid, is_complete FROM orderform WHERE uid = " . $_GET['uid'] . " ORDER BY launch_time DESC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = getDetail($link, $row);
	}
}
mysqli_free_result($res);
mysqli_close($link);
echo json_encode($data);
exit;

function getDetail ($link, $arr) {
	$sql = "SELECT * FROM schedule WHERE sid = " . $arr['sid'];
	$res = mysqli_query($link, $sql);
	$row = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
	return array_merge($arr, $row);
}