<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
if ($_GET['type'] == 'getUserId') {
	$openid = $_GET['openid'];
	$data = getUserId($link, $openid, 0);
} elseif ($_GET['type'] == 'updateUserInfo') {
	$sql = "UPDATE user_info SET nickname = '".$_GET['nickname']."', avatar = '".$_GET['avatar']."' WHERE uid = ".$_GET['userid'];
	mysqli_query($link, $sql);
	$data = array('status' => 'success');
} elseif ($_GET['type'] == 'updateTime') {
	$mysqltime = date('Y-m-d H:i:s', time());
	$sql = "UPDATE user_info SET lastest_login = '$mysqltime' WHERE uid = " . $_GET['userid'];
	mysqli_query($link, $sql);
	$data = array('status' => 'success');
} elseif ($_GET['type'] == 'checkReal') {
	$sql = "SELECT is_realname FROM user_info WHERE uid = " . $_GET['userid'];
	$res = mysqli_query($link, $sql);
	$row = mysqli_fetch_assoc($res);
	$data = array('is_realname' => $row['is_realname']);
	mysqli_free_result($res);
}
mysqli_close($link);
echo json_encode($data);
exit;

function getUserId ($link, $openid, $is_new) {
	if ($is_new > 1) { //avoid recursive function error
		return null;
	}
	$sql = "SELECT uid FROM user_info WHERE openid = '$openid'";
	$res = mysqli_query($link, $sql);
	if (mysqli_num_rows($res)) {
		$row = mysqli_fetch_assoc($res);
		$data = array('new_user' => $is_new, 'userid' => $row['uid']);
		mysqli_free_result($res);
		return $data;
	} else {
		mysqli_free_result($res);
		$new_sql = "INSERT INTO user_info (openid) VALUES ('$openid')";
		if(mysqli_query($link, $new_sql)){
			return getUserId($link, $openid, $is_new+1);
		}
	}
}