<?php
/*
 * schedule table
 */
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
require_once 'util.php';
$data = array();
switch ($_GET['source']) {
	case 'selectBySid':
		$sql = "SELECT * FROM schedule WHERE sid = " . $_GET['sid'];
		$res = mysqli_query($link, $sql);
		$data = mysqli_fetch_assoc($res);
		break;
	case 'selectByDate':
		$sql = "SELECT * FROM schedule WHERE date = '" . $_GET['date'] . "' ORDER BY start_at ASC";
		$res = mysqli_query($link, $sql);
		while ($row = mysqli_fetch_assoc($res)) {
			$data[] = $row;
		}
		break;
	case 'selectByUid':
		$sql = "SELECT * FROM schedule WHERE uid = " . $_GET['uid'] . " ORDER BY date DESC";
		$res = mysqli_query($link, $sql);
		while ($row = mysqli_fetch_assoc($res)) {
			$data[] = $row;
		}
		break;
	case 'selectByMonth':
		$year = $_GET['year'];
		$month = $_GET['month'];
		$sql = "SELECT date, now_member, max_member FROM schedule WHERE date >= '$year-$month-01' and date < '$year-".($month+1)."-01'";
		$res = mysqli_query($link, $sql);
		while ($row = mysqli_fetch_assoc($res)) {
			sscanf($row['date'], "%d-%d-%d", $y, $m, $d);
			if ($row['now_member'] < $row['max_member']) {
				$data[] = array('date' => $d, 'is_full' => false);
			} else {
				$data[] = array('date' => $d, 'is_full' => true);
			}
		}
		break;
	case 'addSchedule':
		if (verify($link, $_GET['uid'], $_GET['sign'])) {
			$sql = "INSERT INTO schedule (uid, name, type, date, start_at, duration, location, max_member) VALUES ('".$_GET['uid']."', '".$_GET['name']."', '".$_GET['ordertype']."', '".$_GET['date']."', '".$_GET['start_time']."', '".$_GET['duration']."', '".$_GET['location']."', '".$_GET['max_member']."')";
			mysqli_query($link, $sql);
			$data = array('status' => 'success');
		} else {
			$data = array('status' => 'denied');
		}
		break;
	default:
		$data = array('status' => 'undefined');
		break;
}
mysqli_close($link);
echo json_encode($data);
exit;