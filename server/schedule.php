<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
require_once 'util.php';
$data = array();
//if (strcmp(md5(getKey($link, $_GET['uid']) . time()), $_GET['sign'])) {
if (strcmp(md5(getKey($link, $_GET['uid'])), $_GET['sign'])) {
	$data['status'] = 'denied';
} else {
	if ($_GET['type'] == 'add') {
		$sql = "INSERT INTO schedule (uid, name, type, date, start_at, duration, location, max_member) VALUES ('".$_GET['uid']."', '".$_GET['name']."', '".$_GET['ordertype']."', '".$_GET['date']."', '".$_GET['start_time']."', '".$_GET['duration']."', '".$_GET['location']."', '".$_GET['max_member']."')";
		mysqli_query($link, $sql);
		$data = array('status' => 'success');
	} elseif ($_GET['type'] == 'problem') {
		$sql = "UPDATE orderform SET has_problem = 1, problem = '"
		. $_GET['problem_text'] . "' WHERE mid = " . $_GET['mid'];
		mysqli_query($link, $sql);
		$data = array('status' => 'success');
	}
}
mysqli_close($link);
echo json_encode($data);
exit;

function isfree ($link, $sid) {
	$sql = "SELECT now_member, max_member FROM schedule WHERE sid = " . $sid;
	$res = mysqli_query($link, $sql);
	$row = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
	if ($row['now_member'] < $row['max_member']) {
		return true;
	} else {
		return false;
	}
}