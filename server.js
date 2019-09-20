const express = require("express"),
			path = require("path"),
			session = require("express-session"),
			bodyParser = require('body-parser'),
			mutipart = require('connect-multiparty'),
			cookieParser = require('cookie-parser'),
			io = require('socket.io'),
			moment = require("moment"),
			Router = require("./src/routers/index");

const app = express();

//托管静态目录
app.use(express.static(path.join(__dirname, "/assets")));

//使用session中间件
app.use(session({secret:'keyboard cat',cookie:{maxAge:60000},rolling:true,resave:false,saveUninitialized:true}));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//图片上传
app.use(mutipart({uploadDir:'./assets/uploads'}));

//Cookie
app.use(cookieParser());

//路由
Router(app);

var server = app.listen(9000, () => {
	console.log("正在监听9000端口");
	
	//open('http://localhost:9000/user/index', {app: ['google chrome', '--incognito']});
});

const db = require("./src/config/db");

const ws = io.listen(server);

//存放当前连接的socket用户
var socketList = {};

ws.on("connection", client => {
	console.log("有人链接了");

	client.on("join", function(nickName) {
		socketList[nickName] = client;
	});

	//添加信息到数据库 => 判断用户是否存在 => 存在则发送消息 => 不存在等上线后再发送消息
	client.on("message", obj => {
		var data = {
	      toid: obj.toid,  
	      fromid: obj.fromid,
	      content: obj.content,
	      status: 0,
	      createtime: moment().unix()
	    }

	    //插入数据库
	    if(JSON.stringify(obj) != "{}") {
	    	var from = obj;

	    	db.table("chat").add(data).then(insertId => {
	    		//判断接收者(fromid)是否在线，在线则发送消息
	    		if(socketList[from.fromUser]) {
	    			//在接收者用户（fromid）界面，发送者则是接收者（toid）
	    			var obj = { 
	    				content: from.content,
	    				fromid: from.toid,
	    				fromAvatar: from.toAvatar, 
	    				fromUser: from.toUser, 
	    				createtime: moment(data.createtime*1000).format('YYYY-MM-DD HH:mm')
						}

	    			socketList[from.fromUser].emit("notify", obj)
	    		}
	    	})
	    }
	});
})