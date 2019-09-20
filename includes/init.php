<?php
ini_set('max_execution_time','100');
ini_set('date.timezone','Asia/Shanghai');
header("Content-type: text/html; charset=UTF-8");
session_start();

$app_path  = dirname(__DIR__);
$admin_path = "../assets/admin";
$admin_assets_path = "../assets";
$uploads_path = $app_path . "/assets/uploads";


define('APP_PATH', $app_path);
define('ADMIN_PATH', $admin_path);
define('ADMIN_ASSETS_PATH', $admin_assets_path);
define('UPLOAD_PATH', $uploads_path);

function __autoload($classname) {
	include_once "extends/{$classname}.class.php";
}

$config = array(
	'password' => 'root',
	'dbname' => 'chat'
);

$db = new DB($config);
$strings = new Strings();


$allow_type = array("jpeg", "jpg", "png", "gif");
//存放上传图片路径
$uploadsDir = UPLOAD_PATH ."/";
$uploadFile = new UploadFile(true, $uploadsDir, $allow_type);

$webname = $db -> select() -> from("setting") -> where("name = 'webname'") -> find();
$copyright = $db -> select() -> from("setting") -> where("name = 'copyright'") -> find();
//查询logo
$logo = $db -> select() -> from("setting") -> where("name = 'logo'") -> find();

include_once "helpers.php";