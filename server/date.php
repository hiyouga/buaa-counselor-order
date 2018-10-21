<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
$year = $_GET['year'];
$month = $_GET['month'];
$sql = "SELECT * FROM schedule WHERE date >= '$year-$month-01' and date < '$year-".($month+1)."-01'";
$res = mysqli_query($link, $sql);
while ($row = mysqli_fetch_assoc($res)) {
	sscanf($row['date'], "%d-%d-%d", $y, $m, $d);
	if ($row['now_member'] < $row['max_member']) {
		$data[] = array('date' => $d, 'is_full' => false);
	} else {
		$data[] = array('date' => $d, 'is_full' => true);
	}
}
mysqli_free_result($res);
mysqli_close($link);
echo json_encode($data);
exit;