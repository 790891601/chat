<?php
include_once "../includes/init.php";
include_once "./common.php";

$action = isset($_GET['action']) ? trim($_GET['action']) : '';
if($action == 'logout') {
    session_unset();
    show("退出成功", "login.php");
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include_once("meta.php");?>
  </head>

  <body>
    
    <!-- 引入头部 -->
    <?php include_once('header.php');?>
    
    <?php include_once('menu.php');?>

    <div class="content">
        <div class="header">
            <h1 class="page-title">后台首页</h1>
        </div>
        <ul class="breadcrumb">
            <li><a href="index.php">首页</a> <span class="divider">/</span></li>
            <li class="active">首页</li>
        </ul>

        <div class="container-fluid">
            <div class="row-fluid">
                <footer>
                    <hr>
                    <p><a href="#" target="_blank"><?php echo $copyright['value']; ?></a></p>
                </footer>
            </div>
        </div>
    </div>
  </body>
</html>
<?php include_once "footer.php" ?>


