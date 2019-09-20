<?php
/**
 * 验证码
 */
session_start();

$width = 100;
$height = 30;
$imageCode = "";
$len = 4;
$font = 20;

$image = imagecreatetruecolor(100, 30);

//生成背景颜色， 背景颜色用白色
$bgcolor = imagecolorallocate($image, 255, 255, 255);

//从0,0开始填充
imagefill($image, 0, 0, $bgcolor);

//验证码随机生成字母和数字
$strArr = str_split("123456789ABCDEFGHIJKLMNabcdefghijklm");

//随机获取索引
$randArr = array_rand($strArr, $len);

//获取随机字符串
for($i = 0; $i < count($randArr); $i++) {
    $index = $randArr[$i];
    $imageCode .= $strArr[$index];
}

//填充
imagefilledrectangle($image, 0, 0, $width, $height, $bgcolor);

//计算验证码
$x = intval($width / 2 - (imagefontwidth($font) * $len / 1.5) );
$y = intval($height / 2 + (imagefontheight($font) / 2));
$color = array(rand(0, 200), rand(0, 200), rand(0, 200));

$color = imagecolorallocate($image, $color[0], $color[1], $color[2]);   

//写入文字
//imagestring($image, $font, $x, $y, $imageCode, $color);
imagettftext($image, $font, 0, $x, $y, $color, '../assets/admin/fonts/calibri.ttf', $imageCode);

for($i = 0; $i < 100; $i++) {
    $x = rand(0, $width);
    $y = rand(0, $height);

    imagesetpixel($image, $x, $y, imagecolorallocate($image, rand(0, 255), rand(0, 255), rand(0, 255)));
}


$_SESSION['imagecode'] = $imageCode;

imagepng($image);
imagedestroy($image);

header("Content-type: image/png;");