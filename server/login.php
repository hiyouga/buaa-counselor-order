<?php
error_reporting(0);
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
define('APPID', '');
define('APPSEC', '');
$ch = curl_init();
$url = "https://api.weixin.qq.com/sns/jscode2session?appid="
	.APPID
	."&secret="
	.APPSEC
	."&js_code="
	.$_GET['code']
	."&grant_type=authorization_code";
$headers = array('Accept: application/json');
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT_MS, 5000);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = json_decode(curl_exec($ch), 1);
curl_close($ch);
unset($res['session_key']);//Do not return risk information
echo json_encode($res);