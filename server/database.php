<?php
define('DB_HOST','localhost');
define('DB_USER','');
define('DB_PASS','');
define('DB_NAME','');
define('DB_PORT','3306');
$link = mysqli_init();
if (!$link) {
	die("mysqli_init failed");
}
if (!mysqli_options($link, MYSQLI_OPT_CONNECT_TIMEOUT, 5)) {
	die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
}
if (!mysqli_real_connect($link, DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)) {
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}
if (!mysqli_set_charset($link, "utf8")) {
    die('Error loading character set utf8: ' . mysqli_error($link));
}