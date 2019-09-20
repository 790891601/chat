const moment = require("moment"),
 	  baseCtrl = require("./baseController");

var db = require("../config/db");

//下拉加载已读消息
module.exports.groupReadChat = function(req, res) {
	var friendid = req.query.friend ? req.query.friend : 0;
	var page = req.query.page ? req.query.page : 1;
	var limit = 5;  //每次请求数量
	var offset = (page - 1) * limit;

	//查询数量
	var where = `(fromid = ${friendid} AND status = 1) OR (toid = ${friendid} AND status = 1)`;
	db.table("chat").where(where).order("createtime desc").count().then(function(count) {
		//查询消息
		var sql = `SELECT chat.*,user.avatar,user.username FROM pre_chat AS chat 
		LEFT JOIN pre_user AS user ON chat.toid = user.id 
		WHERE (chat.fromid = ${friendid} AND chat.status = 1) OR 
		(chat.toid = ${friendid} AND chat.status = 1) ORDER BY createtime DESC LIMIT ${offset},${limit}`;

		db.query(sql).then(function(data) {
			res.setHeader("Content-Type", "application/json;charset=UTF-8");
			res.end(JSON.stringify({data, count}));
		})
	});
}

//查询消息列表
module.exports.groupChatList = function(req, res) {
	var fromid = req.cookies.user.userid ? req.cookies.user.userid : 0;
	
	//查询未读消息
	var sql = `SELECT chat.*,user.avatar,user.username FROM pre_chat AS chat 
				LEFT JOIN pre_user AS user ON chat.toid = user.id 
				WHERE chat.fromid = ${fromid} AND chat.status = 0 
				GROUP BY chat.toid`;
	db.query(sql).then(function(chatList) {
		for(var k in chatList) {
			chatList[k].createtime = moment(chatList[k].createtime * 1000).format('YYYY-MM-DD HH:mm');
		}

		var flag = JSON.stringify(chatList) == "[]" ? false : true;

	  var config = {
			res,
			req,
			data: { chatList, flag },
			file: "index.html"
		}

		baseCtrl.render(config);
	});
}

//查询消息  
module.exports.groupChat = function(req, res) {
	var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
	var friendid = req.query.friend ? req.query.friend : 0;

	//查询好友
	db.table("user").where(`id = ${friendid}`).find().then(friend => {
		//好友不存在
		if(JSON.stringify(friend) == "{}") {
			res.redirect("/user/groupList");
		}

		//查询消息
		var sql = `SELECT chat.*,user.avatar,user.username FROM pre_chat AS chat 
				LEFT JOIN pre_user AS user ON chat.toid = user.id 
				WHERE (chat.fromid = ${friendid} AND chat.status = 0) OR 
				(chat.toid = ${friendid} AND chat.status = 0)`;

		db.query(sql).then(function(chatList) {
			//将未读变成可读
			var data = {
				status: 1
			}

			for(var i = 0; i < chatList.length; i++) {
				db.table("chat").where({id: chatList[i].id}).update(data);
			}
			
			var config = {
				res,
				req,
				data: { friend, chatList },
				file: "chat.html"
			}

			baseCtrl.render(config);
		})
	})
}

//添加分组
module.exports.groupAdd = function(req, res) {
	var config = {
		res,
		req,
		file: "groupAdd.html"
	}

	baseCtrl.render(config);
}

//添加分组
module.exports.groupAddData = function(req, res) {
	var userid = req.cookies.user.userid;
	var name = req.body.name;

	db.table("user_group").where({userid, name}).find().then(group => {
		if(JSON.stringify(group) != "{}") {
			baseCtrl.alert({res, msg: "该分组已经存在", url: "/user/groupAdd"});
			return false;
		}

		//添加分组
		db.table("user_group").add({userid, name}).then(insertId => {
			baseCtrl.alert({res, msg: `${name}分组创建成功`, url: "/user/groupList"})
		}).catch(err => {
			baseCtrl.alert({res, msg: `${name}分组创建失败`, url: "/user/groupAdd"});
		})
	})
}

//展示分组
module.exports.groupList = function(req, res) {
	var userid = req.cookies.user.userid;

	//查看自己分组和好友，将好友放到自己的分组中
	db.table("user_group").where({ userid }).order("id ASC").select().then(group => {
		if(JSON.stringify(group) == "{}") {
		  group = null;
		}

		var sql = `SELECT friends.*,user.username,user.avatar 
					FROM pre_user_friends AS friends 
						LEFT JOIN pre_user AS user ON friends.friend = user.id 
					WHERE friends.userid = ${userid} AND friends.status = 1 
						ORDER BY friends.id ASC`;
		db.query(sql).then(userlist => {
		  	if(JSON.stringify(userlist) != "{}") {
			  	group = group.map(g => {
			  		g.userlist = [];
			  		userlist.map(user => {
			  			if(user.groupid == g.id) {
			  				g.userlist.push(user);
			  			}
			  		})

			  		return g;
			  	})
		  	}
		 	var config = {
				res,
				req,
				file: "groupList.html",
				data: { group }
			}

			baseCtrl.render(config);
		})
	})
}