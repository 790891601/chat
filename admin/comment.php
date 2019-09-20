<?php 
include_once "../includes/init.php";
include_once "./common.php";

$id = isset($_GET['id']) ? $_GET['id'] : 0;

//每页数量
$limit = 5;

//总数量
$res = $db -> select("count(*) as len") -> from("comment") -> where("postid = {$id}") -> find();
$count = $res['len'];

//设置当前页和每页限制数
$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;

if(!$res) {
    die("SQL语句执行错误");
}

//设置偏移值￥
$offset = ($currentPage-1) * $limit;

//分页
$page = page($currentPage, $count, $limit, 5, 'yellow');

$postname = $db -> select() -> from("post") -> where("id = {$id}") -> find();

$data = $db -> select() -> from("comment") -> where("postid = {$id}") -> limit($offset, $limit) -> all();

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <?php include_once "./meta.php"; ?>
  </head>
  <body> 
    <?php include_once "header.php"; ?>
    <?php include_once "menu.php"; ?>
    <div class="content">
        <div class="header">
            <h1 class="page-title">评论列表</h1>
        </div>
        <ul class="breadcrumb">
            <li><a href="index.php">首页</a> <span class="divider">/</span></li>
            <li><a href="userlist.php">用户列表</a> <span class="divider">/</span></li>
            <li class="active"><?php echo $postname['content']; ?>帖子</li>
        </ul>

        <div class="container-fluid">
            <div class="row-fluid">
                <div class="btn-toolbar">
                </div>
                <div class="well">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>内容</th>
                          <th>评论时间</th>
                          <th style="width: 26px;"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php foreach ($data as $key => $item) { ?>
                        <tr>
                          <td><?php echo $item['content']; ?></td>
                          <td><?php echo date("Y-m-d", $item['create_time']); ?></td>
                        </tr>
                        <?php } ?>
                      </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <ul>
                        <?php echo $page; ?>
                    </ul>
                </div>
                
                <footer>
                    <hr>
                    <p>&copy; 2017 <a href="#" target="_blank">copyright</a></p>
                </footer> 
            </div>
        </div>
    </div>
    
    <?php include_once "footer.php"; ?>
    
  </body>
</html>