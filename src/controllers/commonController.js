//加载验证码
const captchapng = require('captchapng');

module.exports.index = function(req, res) {
	res.redirect("/user/index");
}

module.exports.imgCode = function(req, res) {
	var vcode = parseInt(Math.random() * 9000 + 1000);

	//实例化一个验证码对象
  	var p = new captchapng(80, 30, vcode);

  	p.color(0, 0, 0, 0);
  	p.color(80, 80, 80, 255);

  	//保存验证码
  	req.session.imgCode = vcode;

  	//获取一个base64的图片类型
  	var img = p.getBase64();

  	//将图片对象处理成一个二进制的buffer对象
  	var imgbase64 = new Buffer(img, 'base64');

  	res.writeHeader(200, {
  		"Content-type": "image/png"
  	});

  	res.end(imgbase64);
}