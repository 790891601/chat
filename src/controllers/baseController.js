const path = require("path"),
  	  xtpl = require("xtpl"),
      nodemailer = require("nodemailer"),
      smtpTransport = require('nodemailer-smtp-transport'), //smtp发送协议
      wellknown = require("nodemailer-wellknown"); //第三方服务

const auth = require("../config/auth");

module.exports.render = function(obj) {
	var res = obj.res ? obj.res : false;
	var req = obj.req ? obj.req : false;
	var file = obj.file ? obj.file : false;
	var data = obj.data ? obj.data : [];

	if(!res) {
		console.log("未传递相应对象");
    	return false;
	}

	if(!req) {
		console.log("未传递请求对象");
		return false;
	}

	if(!file) {
		console.log('模板文件不存在');
    	return false;
	}

  //如果拥有cookie，也要传递给客户端
  var user = req.cookies.user;
  if(user && JSON.stringify(user) != '{}') {
    data['user'] = user;
  }

	xtpl.renderFile(
		path.join(__dirname, "../views/", file),
		data,
		function(err, content) {
			if(err) {
				console.log(err);
			}

			res.setHeader("Content-Type","text/html;charset=utf-8");
      		res.end(content);
		}
	)
}

//弹框提醒
module.exports.alert = function(obj) {
  var res = obj.res ? obj.res : false;
  var url = obj.url ? obj.url : false;
  var msg = obj.msg ? obj.msg : '未知消息';
  if(!res)
  {
    console.log('无响应对象!');
    return false;
  }

  if(url)
  {
    var content = `<script>alert('${msg}');location.href='${url}';</script>`;
  }else{
    var content = `<script>alert('${msg}');history.go(-1)</script>`;
  }
  
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(content);
}

//生成随机字符串的方法
module.exports.randomStr = function (len = 20) 
{
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) 
  {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//发送邮箱
module.exports.sendEmail = function(options, callback) {
  var config = wellknown(auth.service);   //所选择的第三方服务

  config.auth = {
      user: auth.user,  //邮件账号
      pass: auth.pass   //这里密码不是163密码，是你设置的smtp授权密码
  }

  var transporter = nodemailer.createTransport(smtpTransport(config));

  var mailOptions = {
      from: auth.user,   //发送方的邮件地址
      to: options.address,    //收件人的邮件地址
      subject: options.subject || "邮箱验证",  //邮件主题
      text: "text plain",    //邮件文档类型
      html: options.text || `<a href="http://localhost:9000/user/emailCheck?id=${options.id}">点击认证邮箱</a>`   //邮件正文内容
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback);
}