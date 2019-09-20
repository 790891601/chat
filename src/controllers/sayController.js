const moment = require("moment"),
      baseCtrl = require("./baseController");

var db = require("../config/db");

module.exports.say = function(req, res) {
    var config = {
        res,
        req,
        file: "say.html"
    }

    baseCtrl.render(config);
}

module.exports.sayData = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var content = req.body.content ? req.body.content : "";
    var files = req.files.pic;

    var data = {
        userid,
        create_time: moment().unix(),
        content,
        thumbup: 0,
        count: 0,
        pics: ""
    }

    //单文件上传
    if(files.size) {
        var path = files.path.replace(/\\/g, "/");
        path = path.replace(/\w+(.*)/, (match, $1) => {
            return $1;
        });
       
        data['pics'] = path;
    }else if(files.length > 0) {
        //多文件上传
        for(var i = 0; i < files.length; i++) {
            if(files[i].size > 0) {
                var path = files[i].path.replace(/\\/g, "/");
                path = path.replace(/\w+(.*)/, (match, $1) => {
                    return $1;
                })
                
                data['pics'] += path + ",";
            }
        }

        //去除最后的逗号
        data['pics'] = data['pics'].substring(0, data['pics'].length -1);
    }

    db.table("post").add(data).then(insertId => {
        baseCtrl.alert({res, msg: "发表成功", url: "/user/say"}); 
    }).catch(err => {
       baseCtrl.alert({res, msg: "发表失败，请稍后再试", url: "/user/say"});
    });
}