<?php

class Strings {
    /**
     * 生成随机字符串
     */
    public function randomStr($length = 10, $other = true)
    {
        $str = "";
        $strArr = str_split("123456789ABCDEFGHIJKLMNabcdefghijklm");

        if($other) {
          $otherArr = array('!','@','#', '$', '%', '^', '&', '*', '(', ')', '-', '_','[', ']', '{', '}', '<', '>', '~', '`', '+', '=', ',','.', ';', ':', '/', '?', '|');
          $strArr = array_merge($strArr, $otherArr);
        }

        //随机获取索引
        $randArr = array_rand($strArr, $length);

        for($i = 0; $i < count($randArr); $i++) {
            $index = $randArr[$i];
            $str .= $strArr[$index];
        }

        return $str;
    }
}