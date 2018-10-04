<?php
$time_s = base64_decode($_GET['a']);
$time_e = base64_decode($_GET['b']);

$pat = '/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/';
$good = TRUE;
preg_match($pat, $time_s, $matches);
$good = ($matches !== FALSE);
preg_match($pat, $time_e, $matches);
$good = ($matches !== FALSE);

if(!$good) exit;

$db_host = "dbhome.cs.nctu.edu.tw";
$db_name = "hycheng_cs";
$db_user = "hycheng_cs";
$db_password = "123456";

$dsn = "mysql:host={$db_host};dbname={$db_name}";
$db = new PDO($dsn, $db_user, $db_password);

$sql = "SELECT * FROM `cs_project` WHERE Time BETWEEN ? AND ?";
$sth = $db->prepare($sql);
$sth->execute(array($time_s, $time_e));

$rows = array();
while($row = $sth->fetch( PDO::FETCH_ASSOC ))
	$rows[] = $row;
echo json_encode($rows);
?>
