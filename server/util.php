<?php
function getKey ($link, $uid) {
	$sql = "SELECT unique_key FROM user_info WHERE uid = " . $uid;
	$res = mysqli_query($link, $sql);
	$row = mysqli_fetch_assoc($res);
	mysqli_free_result($res);
	return $row['unique_key'];
}