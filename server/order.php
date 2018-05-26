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
	if ($_GET['type'] == 'order') {
		if (isfree($link, $_GET['sid']) && !isrepeat($link, $_GET['uid'], $_GET['sid'])) {
			$currentTime = date('Y-m-d H:i:s', time());
			$sql = "INSERT INTO orderform (uid, sid, launch_time) VALUES ('".$_GET['uid']."', '".$_GET['sid']."', '$currentTime')";
			mysqli_query($link, $sql);
			add_member($link, $_GET['sid'], $_GET['uid']);
			$data['status'] = 'success';
		} else {
			$data['status'] = 'failed';
		}
	} elseif ($_GET['type'] == 'cancel') {
		$sql = "SELECT sid FROM orderform WHERE mid = " . $_GET['mid'];
		$res = mysqli_query($link, $sql);
		$sid_num = mysqli_fetch_assoc($res);
		mysqli_free_result($res);
		$sql = "DELETE FROM orderform WHERE mid = " . $_GET['mid'];
		mysqli_query($link, $sql);
		dec_member($link, $sid_num['sid'], $_GET['uid']);
		$data['status'] = 'success';
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

function add_member ($link, $sid, $uid) {
	$sql = "UPDATE schedule SET now_member = now_member + 1 WHERE sid = " . $sid;
	mysqli_query($link, $sql);
	$sql = "UPDATE user_info SET all_orders = all_orders + 1 WHERE uid = " . $uid;
	mysqli_query($link, $sql);
	return true;
}

function dec_member ($link, $sid, $uid) {
	$sql = "UPDATE schedule SET now_member = now_member - 1 WHERE sid = " . $sid;
	mysqli_query($link, $sql);
	$sql = "UPDATE user_info SET all_orders = all_orders - 1 WHERE uid = " . $uid;
	mysqli_query($link, $sql);
	return true;
}