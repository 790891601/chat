const moment = require("moment"),
 	  baseCtrl = require("./baseController");

var db = require("../config/db");

//添加好友
module.exports.friendAdd = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    db.table("user_group").where({userid}).select().then(grouplist => {
        if(JSON.stringify(grouplist) == "[]") {
            baseCtrl.alert({res, msg: "请先创建分组", url: "/user/groupAdd"});
            return false;
        }

        var config = {
            res,
            req,
            data: {grouplist},
            file: "friendAdd.html"
        }
    
        baseCtrl.render(config);
    })
}

//添加好友
module.exports.friendAddData = function(req, res) {
    //自己的id  分组id  用户名称
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var groupid = req.body.group ? req.body.group : 0;
    var name = req.body.name ? req.body.name : "";
    var content = req.body.content ? req.body.content : "";

    //查看用户是否存在
    db.table("user").where({username: name}).find().then(user => {
        if(JSON.stringify(user) == "{}") {
            baseCtrl.alert({res, msg: "用户不存在", url: "/user/friendAdd"});
            return false;
        }

        if(userid == user.id) {
            baseCtrl.alert({res, msg: "亲，请不要自己添加自己", url: "/user/friendAdd"});
            return false;
        }

        //查看用户是否已经是好友了
        db.table("user_friends").where({userid, friend: user.id}).find().then(friend => {
            if(JSON.stringify(friend) != "{}") {
                baseCtrl.alert({res, msg: "亲，请不要重复添加该好友", url: "/user/friendAdd"});
                return false;
            }
    
            //添加好友
            var data = {
                friend: user.id,
                userid,
                groupid,
                createtime: moment().unix(),
                content,
                status: 0
            }

            db.table("user_friends").add(data).then(insertId => {
                baseCtrl.alert({res, msg: `${name}添加成功,请等待对方同意`, url: "/user/index"})
            }).catch(err => {
                baseCtrl.alert({res, msg: `${name}添加失败，请稍后再试`, url: "/user/friendAdd"});
            })
        })
    })
}

//添加好友列表
module.exports.friendList = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    // 查看别人是否加我好友
    db.table("user_friends").where(`(status = 0 OR status = 2) and friend = ${userid}`).select().then(friends => {
        if(JSON.stringify(friends) == "[]") {
            res.redirect("/user/index");
            return false;
        }

        //拼接对方id
        var ids = "";
        for(var i = 0; i < friends.length; i++) {
            ids = ids + friends[i].userid + ",";    
        }
        ids = ids.substr(0, ids.length-1);
        
        //查询对方信息
        var sql = `SELECT friend.*,user.username,user.avatar FROM pre_user_friends AS friend LEFT JOIN pre_user AS user ON friend.userid = user.id WHERE (friend.status = 2 OR friend.status = 0) AND friend.userid in (${ids})`
        db.query(sql).then(friendlist =>{
            var config = {
                res,
                req,
                data: {friendlist},
                file: "friendAddList.html"
            }
        
            baseCtrl.render(config);
        });
    })
}

//勇于接受
module.exports.friendAccept = function(req, res) {
    var fromid = req.query.fromid ? req.query.fromid : 0;
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    //如果有分组才会添加好友
    db.table("user_group").where(`userid = ${userid}`).find().then(group => {
        if(JSON.stringify(group) == "{}") {
            res.end("0");
            return false;
        }

        var data = {
            friend: fromid,
            userid: userid,
            groupid: group.id,
            createtime: moment().unix(),
            status: 1
        }

        //插入关系
        db.table("user_friends").add(data).then(insertId => {
            db.table("user_friends").where(`userid = ${fromid} AND friend = ${userid}`).update({status: 1}).then(affectRows => {
                res.end("1");
            })
        });
    })
}

//太丑拒绝 
module.exports.friendReject = function(req, res) {
    var fromid = req.query.fromid ? req.query.fromid : 0;
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    db.table("user_friends").where(`userid=${fromid} AND friend = ${userid}`).update({status: 2}).then(affectRows=> {
        if(affectRows > 0) {
            res.end("1");
        }
        res.end("0");
    })
}