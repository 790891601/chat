const path = require("path"),
	  fs = require("fs"),
	  md5 = require("md5"),
	  baseCtrl = require("./baseController");

var db = require("../config/db");

//个人资料
module.exports.info = function(req, res) {
	db.table("user").where({id: req.cookies.user.userid}).find().then(user=> {
		var config = {
			res, 
			req,
			file: "info.html"
		}

		//如果有邮箱就传递
		if(JSON.stringify(user) != '{}') {
			config.data = {
				info: {
					email: user.email,
					status: user.status
				}
			}
		}
		
		baseCtrl.render(config);
	})
}

//个人资料提交
module.exports.infoData = function(req, res) {
	var id = req.cookies.user.userid;
	var body = req.body;

	db.table("user").where(`id = '${id}'`).find().then(user => {
		var data = {};

		//验证密码是否存在
		if(body.password && body.password != '') {
			//重新生成密码盐
		    var salt = baseCtrl.randomStr();
		    var repass = body.password;
		    var password = md5(repass + salt);


		    data.password = password;
		    data.salt = salt;
		}

		//验证邮箱是否存在
		if(body.email && body.email != '') {
			//当前email和之前的email是否相同
			if(user.email != body.email) {
				data.email = body.email;	
				data.status = 0;
			}
		}


		//文件上传
		if(JSON.stringify(req.files) != "{}" && req.files.avatar.size > 0) {
			var filename = path.basename(req.files.avatar.path);
		    var avatar = path.join("/uploads/",filename);
		    data.avatar = avatar;

		    //删除旧图片
		    fs.unlink(path.join(__dirname, "../../assets", user.avatar), err => {
		    	console.log(err);
		    })
		}

		//如果是空对象就不用查询数据库了
		if(JSON.stringify(data) == '{}') {
			res.redirect('/user/info');
			return false;
		}

		db.table("user").where(`id = '${id}'`).update(data).then(affectRows => {
			if(data.avatar){
		        //更新完用户信息之后要更新一下cookie缓存
		       res.cookie("user", { userid: id, username: user.username, avatar: data.avatar }, { maxAge: 3600 * 24 * 1000 });
		    }

			res.redirect('/user/info');
		}).catch(err => {
			baseCtrl.alert({res, msg: err});
		})
	}).catch(err => {
		baseCtrl.alert({res, msg: err})
	})
}