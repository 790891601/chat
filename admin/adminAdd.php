<?php 
include_once "../includes/init.php";
include_once "./common.php";

$id = isset($_GET['id']) ? trim($_GET['id']) : false;
$username = "";
$email = "";
$avatar = "";

//POST请求
if($_POST) {
  $data = array();
  foreach ($_POST as $key => $value) {
    if($key != 'id') {
      $data[$key] = $value;
    }
  }

  //用户名冲突
  if(!$id) {
    $res = $db -> select("username") -> from("admin") -> where("username = '" . $data['username'] . "'") -> find();
    if($res) {
      show("用户名已存在", "adminAdd.php"); die;
    }
  }

  //获取当前时间
  $data['register_time'] = time();

  //上传头像
  if($_FILES['avatar']) {
    if($uploadFile -> upload_file($_FILES['avatar'])) {
      $data['avatar'] = $uploadFile -> get_file_name();
    }
  }
  
  if($id) {
    //查询图片路径
    $res = $db -> select('avatar') -> from("admin") -> where("id = '$id'") -> find();
    
    //存放图片路径
    $filename = $uploadsDir . $res["avatar"];

    //查找图片存在不，存在就删除，不存在就直接更新
    if(is_file($filename)) {
      $res = unlink($filename);
    }

    //更新
    if($db -> save("admin", $data, "id='{$id}'")) {
      show("更新成功", "adminList.php"); die;
    }
    show("更新失败", "adminList.php"); die;
  }
  
  if($db -> save("admin", $data)) {
    show("插入成功", "adminList.php");
  }
}

if($id) {
  //编辑页面
  $where = array(
    'id' => $id
  );
  $data = $db -> select() -> from("admin") -> where($where) -> find();
  
  $username = $data['username'];
  $email = $data['email'];
  $avatar =  "../assets/uploads/" . $data['avatar'];
}

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
            <h1 class="page-title">管理员修改</h1>
        </div>
        <ul class="breadcrumb">
            <li><a href="adminList.php">管理员列表</a> <span class="divider">/</span></li>
            <li class="active">管理员修改</li>
        </ul>

        <div class="container-fluid">
            <div class="row-fluid">
                    
                <div class="btn-toolbar">
                    <button class="btn btn-primary" onClick="location='adminList.php'"><i class="icon-list"></i> 管理员列表</button>
                  <div class="btn-group">
                  </div>
                </div>

                <div class="well">
                    <div id="myTabContent" class="tab-content">
                      <div class="tab-pane active in" id="home">
                        <form method="POST" enctype="multipart/form-data">
                            <label>用户名</label>
                            <input required name="username" type="text" value="<?php echo $username; ?>" class="input-xxlarge">                            
                            <label>头像</label>
                            <?php if(!empty($avatar)) { ?>
                              <img class="img-responsive book_thumb" src="<?php echo $avatar; ?>" />
                            <?php } ?>
                            <input name="avatar" type="file" value="" class="input-xxlarge"> 
                                  
                            <label>邮箱</label>
                            <input required name="email" type="text" value="<?php echo $email; ?>" class="input-xxlarge">       
                            <label></label>
                            <input class="btn btn-primary" type="submit" value="提交" />
                        </form>
                      </div>
                  </div>
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


