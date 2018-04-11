<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
if ($_GET['type'] == 'getUserId') {
	$openid = $_GET['openid'];
	$data = getUserInfo($link, $openid, 0);
} elseif ($_GET['type'] == 'updateTime') {
	$mysqltime = date('Y-m-d H:i:s', time());
	$sql = "UPDATE user_info SET lastest_login = '$mysqltime' WHERE uid = " . $_GET['userid'];
	mysqli_query($link, $sql);
	$data = array('status' => 'success');
} elseif ($_GET['type'] == 'checkReal') {
	$sql = "SELECT is_realname FROM user_info WHERE uid = " . $_GET['userid'];
	$res = mysqli_query($link, $sql);
	$data = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
} elseif ($_GET['type'] == 'updateReal') {
	$sql = "UPDATE user_info SET is_realname = 1, class_id = '"
	. $_GET['class_id'] . "', stu_id = '"
	. $_GET['stu_id'] . "', stu_name = '"
	. $_GET['stu_name'] . "' WHERE uid = " . $_GET['userid'];
	mysqli_query($link, $sql);
	$data = array('status' => 'success');
} elseif ($_GET['type'] == 'getReal') {
	$sql = "SELECT is_realname, class_id, stu_id, stu_name FROM user_info WHERE uid = " . $_GET['userid'];
	$res = mysqli_query($link, $sql);
	$data = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
} else {
	$data['error'] = 'No input data!';
}
mysqli_close($link);
echo json_encode($data);
exit;

function getUserInfo ($link, $openid, $is_new) {
	if ($is_new > 1) { //avoid recursive function error
		return null;
	}
	$sql = "SELECT uid, unique_key FROM user_info WHERE openid = '$openid'";
	$res = mysqli_query($link, $sql);
	if (mysqli_num_rows($res)) {
		$data = mysqli_fetch_assoc($res);
		$data['new_user'] = $is_new;
		mysqli_free_result($res);
		return $data;
	} else {
		mysqli_free_result($res);
		$unique_key = md5($openid . rand(1, 1000));
		$new_sql = "INSERT INTO user_info (openid, unique_key) VALUES ('$openid', '$unique_key')";
		if(mysqli_query($link, $new_sql)){
			return getUserInfo($link, $openid, $is_new+1);
		}
	}
}