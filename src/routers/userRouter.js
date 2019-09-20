const express = require("express"),
	  db = require("../config/db"),
	  indexCtrl = require("../controllers/indexController");

var userRouter = express.Router();

//认证User是否存在
const checkUser = function(req, res, next) {
	var user = req.cookies.user;

	//该用户不存在
	if(!user || JSON.stringify(user) == "{}") {
		res.redirect("/user/login");
		return false;
	}

	db.table("user").where(`id = '${user.userid}'`).find().then(data => {
		if(JSON.stringify(data) == '{}') {
			//可能是伪造的id，销毁cookie
			res.cookie("user", null, {maxAge: 0});
			return false;
		}

		next();
	}).catch(err => {
		console.log(err);
		return false;
	});
}

//首页 个人资料 邮箱认证
userRouter.get("/index", checkUser, indexCtrl.index);
userRouter.get("/info", checkUser, indexCtrl.info);
userRouter.post("/info", checkUser, indexCtrl.infoData);
userRouter.get("/email", checkUser, indexCtrl.email);
userRouter.get("/emailCheck", checkUser, indexCtrl.emailCheck);

//用户分组  显示分组 
userRouter.get('/groupAdd', checkUser, indexCtrl.groupAdd);
userRouter.post('/groupAdd', checkUser, indexCtrl.groupAddData);
userRouter.get('/groupList',checkUser, indexCtrl.groupList);

//消息查看 下拉加载已读消息
userRouter.get('/groupChat',checkUser, indexCtrl.groupChat);
userRouter.get('/groupReadChat',checkUser, indexCtrl.groupReadChat);

//添加好友  添加好友列表 
userRouter.get("/friendAdd", checkUser, indexCtrl.friendAdd);
userRouter.post("/friendAdd", checkUser, indexCtrl.friendAddData);
userRouter.get("/friendList", checkUser, indexCtrl.friendList);

//勇于接受 太丑拒绝
userRouter.get("/friendAccept", checkUser, indexCtrl.friendAccept);
userRouter.get("/friendReject", checkUser, indexCtrl.friendReject);

//空间上拉刷新  下拉加载
userRouter.get("/spaceReset", checkUser, indexCtrl.spaceReset);
userRouter.get("/spaceNext", checkUser, indexCtrl.spaceNext);

//空间 评论 点赞 转发
userRouter.get("/space", checkUser, indexCtrl.space);
userRouter.post("/spaceData", checkUser, indexCtrl.spaceData);
userRouter.get("/thumbup", checkUser, indexCtrl.thumbup);
userRouter.get("/forward", checkUser, indexCtrl.forward);

//说说
userRouter.get("/say", checkUser, indexCtrl.say);
userRouter.post("/say", checkUser, indexCtrl.sayData);

//登录/注册/找回密码/注销
userRouter.get("/login", indexCtrl.login);
userRouter.post("/login", indexCtrl.loginData);
userRouter.get("/register", indexCtrl.register);
userRouter.post("/register", indexCtrl.registerData);
userRouter.get("/password", indexCtrl.password);
userRouter.post("/password", indexCtrl.passwordData);
userRouter.get("/logoin", checkUser, indexCtrl.logoin);

module.exports = userRouter;