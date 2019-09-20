<?php
include_once("../includes/init.php");

//验证是否已登录
$adminid = isset($_SESSION['adminid']) ? trim($_SESSION['adminid']) : false;

if($adminid) {
  checkLogin(true); die;
}


if($_POST) {
   //验证码
   if(strtolower(trim($_SESSION['imagecode'])) != strtolower(trim($_POST['imgcode']))) {
       //验证码不通过
       show("验证码错误, 请重新输入", "login.php"); die;
   }

   //验证用户
   $username = isset($_POST['username']) ? trim($_POST['username']) : '';

   $where = array(
       'username' => $username
   );

   $data = $db -> select() -> from("admin") -> where($where) -> find();

   if(!$data) {
       show("用户不存在，请重新输入", "login.php"); die;
   }

   $password = isset($_POST['password']) ? trim($_POST['password']) : '';

   if($data['password'] != md5($data['salt'] . $password)) {
      show("密码错误，请重新输入", "login.php"); die;
   }

   $_SESSION['adminid'] = $data['id'];
   $_SESSION['username'] = $data['username'];
   show("登录成功", "index.php");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include_once("meta.php");?>
  </head>

  <body>
    
    <div class="navbar">
        <div class="navbar-inner">
            <a class="brand" href="index.php"><span class="second">Admin</span></a>
        </div>
    </div>

    <div class="row-fluid">
        <div class="dialog">
            <div class="block">
                <p class="block-heading">登录</p>
                <div class="block-body">
                    <form method="post">
                        <label>用户名</label>
                        <input type="text" name="username" class="span12" placeholder="请输入用户名" required />
                        <label>密码</label>
                        <input type="password" name="password" class="span12" placeholder="请输入密码" required />
                        <label>验证码</label>
                        <input type="text" name="imgcode" class="span12" placeholder="请输入验证码" required />
                        <div>
                          <img src='imageCode.php' onclick="this.src='imageCode.php?random='+Math.random()" />
                        </div>
                        <button type="submit" class="btn btn-primary pull-right">登录</button>
                        <div class="clearfix"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    
    <?php include_once "footer.php" ?>
    
  </body>
</html>


