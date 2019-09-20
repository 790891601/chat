const infoCtrl = require("./infoController"),
	  friendCtrl = require("./friendController"),
	  sayCtrl = require("./sayController"),
	  spaceCtrl = require("./spaceController"),
	  groupCtrl = require("./groupController"),
	  userCtrl = require("./userController");

var UserController = {};

//添加分组  展示分组  
UserController.groupAdd = groupCtrl.groupAdd;
UserController.groupAddData = groupCtrl.groupAddData;
UserController.groupList = groupCtrl.groupList;

//查看消息 消息列表 下拉加载已读消息 
UserController.groupChat = groupCtrl.groupChat;
UserController.index = groupCtrl.groupChatList;
UserController.groupReadChat = groupCtrl.groupReadChat;

//添加好友 添加好友列表 
UserController.friendAdd = friendCtrl.friendAdd;
UserController.friendAddData = friendCtrl.friendAddData;
UserController.friendList = friendCtrl.friendList;

//勇于接受 太丑拒绝
UserController.friendAccept = friendCtrl.friendAccept;
UserController.friendReject = friendCtrl.friendReject;

//空间上拉刷新  下拉加载
UserController.spaceReset = spaceCtrl.spaceReset;
UserController.spaceNext = spaceCtrl.spaceNext;

//空间 点赞 转发
UserController.space = spaceCtrl.space;
UserController.spaceData = spaceCtrl.spaceData;
UserController.thumbup = spaceCtrl.thumbup;
UserController.forward = spaceCtrl.forward;

//说说
UserController.say = sayCtrl.say;
UserController.sayData = sayCtrl.sayData;

//个人资料
UserController.info = infoCtrl.info;
UserController.infoData = infoCtrl.infoData;

//退出登录
UserController.logoin = userCtrl.logoin;

//发送邮箱 邮箱认证
UserController.email = userCtrl.email;
UserController.emailCheck = userCtrl.emailCheck;

//注册
UserController.register = userCtrl.register;
UserController.registerData = userCtrl.registerData;

//登录
UserController.login = userCtrl.login;
UserController.loginData = userCtrl.loginData;

//找回密码
UserController.password = userCtrl.password;
UserController.passwordData = userCtrl.passwordData;

module.exports = UserController;