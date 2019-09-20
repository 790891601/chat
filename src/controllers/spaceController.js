const moment = require("moment"),
      baseCtrl = require("./baseController");

var db = require("../config/db");

function callback(req, res, spacelist, thumbupUsers) {
    //评论数据： 评论表 + 用户表
    var sql = "SELECT comment.*,user.username FROM pre_comment AS comment LEFT JOIN pre_user AS USER ON user.id = comment.userid";
    db.query(sql).then(commentlist => {
        //无限级循环
        for(var k in commentlist) {
            commentlist[k].deepStr = "";
            if(commentlist[k].deep != 0) {
                commentlist[k].deepStr = "--".repeat(commentlist[k].deep);
            }
        }

        for(var i = 0, count = thumbupUsers.length; i < count; i++) {
            //数字类型转换字符串类型
            thumbupUsers[i].id = thumbupUsers[i].id + ""; 

            //点赞用户名
            thumbupUsers[i].username = thumbupUsers[i].username;
        }

        var config = {
            res,
            req,
            data: { spacelist, commentlist, thumbupUsers },
            file: "space.html"
        }
    
        baseCtrl.render(config);
    });
}

//空间
module.exports.space = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    //朋友表： 查询自己的好友
    var sql = `SELECT friend FROM pre_user_friends WHERE userid = ${userid} AND status = 1`;
    db.query(sql).then(function(friends) {
        //所有的好友     组装好友id
        var ids = [userid];
        for(var j = 0; j < friends.length; j++) {
            ids.push(friends[j].friend);
        }
        var friendids = ids.join(",");

        //帖子数据： 帖子表 + 用户表
        var sql = `SELECT post.*,user.username,user.avatar FROM pre_post as post LEFT JOIN pre_user as user ON user.id = post.userid WHERE userid in(${friendids}) ORDER BY post.create_time DESC`;
        db.query(sql).then(spacelist => {
            //点赞ids
            var thumbupIds = [];

            for(var k in spacelist) {
                spacelist[k].create_time = moment(spacelist[k].create_time * 1000).format('YYYY-MM-DD HH:mm');
                
                //处理图片
                if(spacelist[k].pics != "") {
                    spacelist[k].pics = spacelist[k].pics.split(",");
                }

                //增加浏览次数
                db.table("post").where(`id = ${spacelist[k].id}`).update({count: spacelist[k].count+1});

                //处理点赞    
                if(spacelist[k].thumbup == "0") {
                    spacelist[k].thumbup = [];
                }else {
                    //查询点赞用户
                    var ids = spacelist[k].thumbup = spacelist[k].thumbup.split(",");

                    for(var i = 0; i < ids.length; i++) {
                        //本用户已点赞
                        if(ids[i] == userid) {
                            spacelist[k].isThumbup = true;
                        }
                        thumbupIds.push(ids[i]);
                    }
                }
            }

            var ids = thumbupIds.join(",");

            //查询点赞用户名
            var sql = `SELECT id,username FROM pre_user WHERE id in(${ids})`;
            db.query(sql).then(thumbupUsers => {
                callback(req, res, spacelist, thumbupUsers);
            });
        });
    })
}

//更新点赞
module.exports.thumbup = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var id = req.query.id ? req.query.id : 0;

    db.table("post").where(`id = ${id}`).find().then(post => {
        var thumbup = "";

        //是否已点赞  true未点赞  false已点赞
        var flag = true;

         //点赞默认值是0
        if(post.thumbup == "0") {
            thumbup = userid;
        }else {
            var thumbups = post.thumbup.split(",");

            //遍历查询点赞
            for(var i = 0; i < thumbups.length; i++) {
                if(thumbups[i] == userid) {
                    //重复点赞则取消
                    thumbups.splice(i, 1);
                    flag = false;
                    break;
                }
            }
            
            thumbup = thumbups.join(",");
            //处理 取消点赞为空
            if(thumbup == "") {
                thumbup = "0";
            }

            //点赞
            if(flag) {
                thumbup = post.thumbup + "," + userid;
            }
        }

        db.table("post").where(`id = ${id}`).update({thumbup}).then(affectedRow => {
            if(flag) {
                //点赞
                res.end("1");
            }else {
                //取消点赞
                res.end("2");
            }
        }).catch(err => {
            res.end("0");
        });
    }).catch(err => {
        res.end("0");
    });
}

//转发
module.exports.forward = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var id = req.query.id ? req.query.id : 0;

    db.table("post").where(`id = ${id}`).find().then(post => {
        var data = {
            userid,
            create_time: moment().unix(),
            content: post.content,
            thumbup: "0",
            pics: post.pics,
            count: post.count
        }

        db.table("post").add(data).then(insertId => {
            res.end("1");
        }).catch(err => {
            res.end("0");
        });
    }).catch(err => {
        res.end("0");
    });
}

//评论
module.exports.spaceData = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var postid = req.body.postid ? req.body.postid : 0;
    var deep = req.body.deep ? req.body.deep : 0;
    var parentid = req.body.parentid ? req.body.parentid : 0;
    var content = req.body.content ? req.body.content : "";

    //组装数据
    var data = {
        postid,
        content,
        deep,
        parentid,
        userid,
        create_time: moment().unix()
    }

    db.table("comment").where(`postid = ${postid}`).add(data).then(insertId => {
        res.end(`${insertId}`);
    }).catch(err => {
        res.end("0");
    });
}

//上拉刷新
module.exports.spaceReset = function(req, res) {
    res.end("space reset");
}

//下拉加载
module.exports.spaceNext = function(req, res) {
    res.end("space next");
}