<?php
/*
 * orderform table
 */
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
require_once 'util.php';
$data = array();
switch ($_GET['source']) {
	case 'order':
		if (verify($link, $_GET['uid'], $_GET['sign'])) {
			if (isfree($link, $_GET['sid']) && !isrepeat($link, $_GET['uid'], $_GET['sid'])) {
				$currentTime = date('Y-m-d H:i:s', time());
				$sql = "INSERT INTO orderform (uid, sid, launch_time) VALUES ('".$_GET['uid']."', '".$_GET['sid']."', '$currentTime')";
				mysqli_query($link, $sql);
				add_member($link, $_GET['sid'], $_GET['uid']);
				$data['status'] = 'success';
			} else {
				$data['status'] = 'failed';
			}
		} else {
			$data = array('status' => 'denied');
		}
		break;
	case 'cancel':
		if (verify($link, $_GET['uid'], $_GET['sign'])) {
			$sql = "SELECT sid FROM orderform WHERE mid = " . $_GET['mid'];
			$res = mysqli_query($link, $sql);
			$sid_num = mysqli_fetch_assoc($res);
			mysqli_free_result($res);
			$sql = "DELETE FROM orderform WHERE mid = " . $_GET['mid'];
			mysqli_query($link, $sql);
			dec_member($link, $sid_num['sid'], $_GET['uid']);
			$data['status'] = 'success';
		} else {
			$data = array('status' => 'denied');
		}
		break;
	case 'problem':
		if (verify($link, $_GET['uid'], $_GET['sign'])) {
			$sql = "UPDATE orderform SET has_problem = 1, problem = '" . $_GET['problem_text'] . "' WHERE mid = " . $_GET['mid'];
			mysqli_query($link, $sql);
			$data = array('status' => 'success');
		} else {
			$data = array('status' => 'denied');
		}
		break;
	case 'selectByUid':
		$sql = "SELECT mid, sid, is_complete, has_problem, problem FROM orderform WHERE uid = " . $_GET['uid'] . " ORDER BY launch_time DESC";
		$res = mysqli_query($link, $sql);
		while ($row = mysqli_fetch_assoc($res)) {
			$data[] = getDetail($link, $row);
		}
		break;
	default:
		$data = array('status' => 'undefined');
		break;
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

function getDetail ($link, $arr) {
	$sql = "SELECT * FROM schedule WHERE sid = " . $arr['sid'];
	$res = mysqli_query($link, $sql);
	$row = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
	return array_merge($arr, $row);
}