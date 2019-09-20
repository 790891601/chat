const md5 = require("md5"),
      moment = require("moment"),
      baseCtrl = require("./baseController");

var db = require("../config/db");

//退出登录
module.exports.logoin = function(req, res) {
	res.cookie("user", "", {maxAge: 0});
	res.redirect("/user/login");
}

//发送邮箱
module.exports.email = function(req, res) {
	var id = req.cookies.user.userid || 0;
	var email = req.query.email || "";

	baseCtrl.sendEmail({address: email, id}, function(error, info) {
      if(error){
          baseCtrl.alert({res, msg: "邮箱发送失败，请稍后再试", url: "/user/info"});
          return false;
      }
      
      baseCtrl.alert({res, msg: "邮箱发送成功，请注意查收", url: "/user/info"});
	});
}

//邮箱认证
module.exports.emailCheck = function(req, res) {
	var id = req.query.id || 0;

	var data = {
		status: 1
	}
	
	db.table("user").where({id: id}).update(data).then(affectRows => {
		//影响行数为 0
		if(affectRows < 1) {
			baseCtrl.alert({res, msg: "邮箱认证失败，请稍后再试", url: "/user/info"});
          	return false;
		}
		baseCtrl.alert({res, msg: "邮箱认证成功", url: "/user/info"});
	})
}

module.exports.register = function(req, res) {
	var config = {
		res,
		req,
		file: "register.html"
	}

	baseCtrl.render(config);
}

//注册数据
module.exports.registerData = function(req, res) {
	//判断是否有数据过来
	var body = req.body;
	if(!body && JSON.stringify(body) == "{}") {
		baseCtrl.alert({res, msg: "没有表单提交"});
		return false;
	}

	//判断验证码是否等于
	if(body.imgCode != req.session.imgCode) {
		baseCtrl.alert({res, msg: "验证码错误"});
		return false;
	}

	var username = body.username || '';

	//判断用户名是否重复
	db.table('user').where(`username = '${username}'`).find().then(check => {
		//没有重复可以注册
	    if(JSON.stringify(check) != "{}") {
			baseCtrl.alert({res, msg: "你的用户名已存在"});
			return false;
	    }

	    
	    if(!body.password) {
	    	baseCtrl.alert({res, msg: "密码不能为空"});
	    	return false;
	    }

	    //生成密码盐
	    var salt = baseCtrl.randomStr();
	    var repass = body.password;
	    var password = md5(repass + salt);

	    //开始注册
	    var data = {
	    	username,
	    	salt,
	    	password,
	    	createtime: moment().unix()
	    }

	    //注册
	    db.table("user").add(data).then(insertId => {
	    	res.redirect('/user/login');
	    }).catch(err => {
	    	baseCtrl.alert({res, msg: err});
	    	return false;
	    })
	}).catch(err => {
		baseCtrl.alert({res, msg: err});
		return false;
	})
}

//登录
module.exports.login = function(req, res) {
	var config = {
		res,
		req,
		file: "login.html"
	}

	baseCtrl.render(config);
}

//登录
module.exports.loginData = function(req, res) {
	//验证码
	if(req.body.imgCode != req.session.imgCode) {
		baseCtrl.alert({res, msg: "验证码错误"});
		return false;
	}

	//查询用户名
	db.table('user').where(`username = '${req.body.username}'`).find().then(user => {
		if(JSON.stringify(user) == '{}') {
			baseCtrl.alert({res, msg: "该用户不存在"});
			return false;
		}

		//验证密码
		if(user.password != md5(req.body.password + user.salt)) {
			baseCtrl.alert({res, msg: "密码错误"});
			return false;
		}

		//设置cookie
		res.cookie("user", {userid: user.id, username: user.username, avatar: user.avatar || ''}, {maxAge: 60*60*24*1000});

		res.redirect("/user/index");
	}).catch(err => {
		baseCtrl.alert({res, msg: err});
		return false;
	})
}

module.exports.password = function(req, res) {
	var config = {
		res,
		req,
		file: "password.html"
	}

	baseCtrl.render(config);
}

//找回密码
module.exports.passwordData = function(req, res) {
	var body = req.body;

	if(JSON.stringify(body) == "{}") {
		baseCtrl.alert({res, msg: "数据提交失败", url: "/user/password"});
		return false;
	}

	if(body.imgCode != req.session.imgCode) {
		baseCtrl.alert({res, msg: "验证码错误", url: "/user/password"});
		return false;
	}

	db.table("user").where({username: body.username}).find().then(user => {
		//用户名没找到  ||  邮箱等于空 || 邮箱没验证 
		if(JSON.stringify(user) == "{}" || JSON.stringify(user.email) == "" || user.status == 0) {
			baseCtrl.alert({res, msg: "邮箱发送失败", url: "/user/password"});
			return false;
		}

		var config = {
			address: user.email,
			id: user.id,
			subject: "找回密码",
			text: `<p>您的密码已重置成<b>123456</b>  <br>
					Tips: 为了您的安全，请不要在公众场合使用邮箱认证</p>`
		}

		baseCtrl.sendEmail(config, function(error, info) {
	      if(error){
	          baseCtrl.alert({res, msg: "邮箱发送失败，请稍后再试", url: "/user/password"});
	          return false;
	      }

	      var data = {
	      	password: md5("123456" + user.salt)
	      }

	      //直接重置密码
	      db.table("user").where({id:user.id}).update(data).then(affectRows => {
	      	if(affectRows < 1) {
	      		baseCtrl.alert({res, msg: "邮箱发送失败，请稍后再试", url: "/user/password"});
	          	return false;
	      	}

	      	baseCtrl.alert({res, msg: "邮箱发送成功，请注意查收", url: "/user/login"});
	      })
		});
	})
}