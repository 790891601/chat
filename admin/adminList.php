<?php 
include_once "../includes/init.php";
include_once "./common.php";

//删除一条  批量删除
$id = isset($_GET['id']) ? $_GET['id'] : false;
if($id) {
    if($db -> del("admin", $id)) {
      //删除文件
      $res = $db -> select('avatar') -> from("admin") -> where("id = '$id'") -> find();
      $filename = $uploadsDir . $res["avatar"];

      if(is_file($filename)) {
        $res = unlink($filename);
      }

      show("删除成功", "adminList.php");
    }else {
      show("删除失败", "adminList.php");
    }
}

//每页数量
$limit = 5;

//总数量
$res = $db -> select("count(*) as len") -> from("admin") -> find();
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

$data = $db -> select() -> from("admin") -> limit($offset, $limit) -> all();

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
            <h1 class="page-title">管理员列表</h1>
        </div>
        <ul class="breadcrumb">
            <li><a href="index.php">首页</a> <span class="divider">/</span></li>
            <li class="active">管理员管理</li>
        </ul>

        <div class="container-fluid">
            <div class="row-fluid">
                <div class="btn-toolbar">
                    <button class="btn btn-primary" onClick="location='adminAdd.php'"><i class="icon-plus"></i>增加管理员</button>
                    <button class="btn" id="allDelBtn"><i class="icon-plus"></i>批量删除</button>
                </div>
                <div class="well">
                    <table class="table">
                      <thead>
                        <tr>
                          <th><input type="checkbox" id="allcheckbox" /></th>
                          <th>用户名</th>
                          <th>头像</th>
                          <th>邮箱</th>
                          <th>创建时间</th>
                          <th style="width: 26px;"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php foreach ($data as $key => $item) { ?>
                        <tr>
                          <td><input type="checkbox" name="items[]" class="item" value="<?php echo $item['id']; ?>" /></td>
                          <td><?php echo $item['username']; ?></td>
                          <td>
                            <?php if(empty($item['avatar'])) { ?>
                              <img class="img-responsive book_thumb" src="<?php echo ADMIN_PATH . '/images/cover.png'; ?>" />
                            <?php }else{ ?>
                              <img class="img-responsive book_thumb" src="<?php echo "../assets/uploads/" . $item['avatar']; ?>" />
                            <?php } ?>
                          </td>
                          <td><?php echo $item['email']; ?></td>
                          <td><?php echo date('Y-m-d', $item['register_time']); ?></td>
                          <td>
                              <a href="adminAdd.php?id=<?php echo $item['id']; ?>"><i class="icon-pencil"></i></a>
                              <a href="javascript:;" onclick="location.href='adminList.php?id=<?php echo $item['id']; ?>'" role="button" data-toggle="modal"><i class="icon-remove"></i></a>
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

                <div class="modal small hide fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="myModalLabel">Delete Confirmation</h3>
                    </div>
                    <div class="modal-body">
                        <p class="error-text"><i class="icon-warning-sign modal-icon"></i>Are you sure you want to delete the user?</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
                        <button class="btn btn-danger" data-dismiss="modal">Delete</button>
                    </div>
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


