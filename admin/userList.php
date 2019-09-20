<?php 
include_once "../includes/init.php";
include_once "./common.php";

//每页数量
$limit = 5;

//总数量
$res = $db -> select("count(*) as len") -> from("user") -> find();
$count = $res['len'];

//设置当前页和每页限制数
$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;

if(!$res) {
    die("SQL语句执行错误");
}

//设置偏移值
$offset = ($currentPage-1) * $limit;

//分页
$page = page($currentPage, $count, $limit, 5, 'yellow');

$data = $db -> select() -> from("user") -> limit($offset, $limit) -> all();

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
            <h1 class="page-title">用户列表</h1>
        </div>
        <ul class="breadcrumb">
            <li><a href="index.php">首页</a> <span class="divider">/</span></li>
            <li class="active">用户列表</li>
        </ul>

        <div class="container-fluid">
            <div class="row-fluid">
                <div class="btn-toolbar">
                </div>
                <div class="well">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>用户名</th>
                          <th>头像</th>
                          <th>操作</th>
                          <th style="width: 26px;"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php foreach ($data as $key => $item) { ?>
                        <tr>
                          <td><?php echo $item['username']; ?></td>
                          <td>
                            <?php if(empty($item['avatar'])) { ?>
                              <img class="img-responsive book_thumb" src="<?php echo ADMIN_PATH . '/images/cover.png'; ?>" />
                            <?php }else{ ?>
                              <img class="img-responsive book_thumb" src="<?php echo "../assets/" . $item['avatar']; ?>" />
                            <?php } ?>
                          </td>
                          <td>
                              <a href="friend.php?id=<?php echo $item['id']; ?>">查看好友</a>
                              <a href="post.php?id=<?php echo $item['id']; ?>">查看帖子</a>
                          </td>
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