<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
$data = array();
if (isfree($link, $_GET['sid']) && !isrepeat($link, $_GET['uid'], $_GET['sid'])) {
	$currentTime = date('Y-m-d H:i:s', time());
	$sql = "INSERT INTO orderform (uid, sid, launch_time) VALUES ('".$_GET['uid']."', '".$_GET['sid']."', '$currentTime')";
	mysqli_query($link, $sql);
	add_member($link, $_GET['sid']);
	$data['status'] = 'success';
} else {
	$data['status'] = 'failed';
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

function isrepeat ($link, $uid, $sid) {
	$sql = "SELECT uid FROM orderform WHERE sid = " . $sid;
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		if ($row['uid'] == $uid) {
			mysqli_free_result($res);
			return true;
		}
	}
	mysqli_free_result($res);
	return false;
}

function add_member ($link, $sid) {
	$sql = "UPDATE schedule SET now_member = now_member + 1 WHERE sid = " . $sid;
	mysqli_query($link, $sql);
	return true;
}