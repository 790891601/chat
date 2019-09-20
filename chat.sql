-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2019 年 09 月 08 日 08:10
-- 服务器版本: 5.5.53
-- PHP 版本: 5.4.45

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `chat`
--

-- --------------------------------------------------------

--
-- 表的结构 `pre_admin`
--

CREATE TABLE IF NOT EXISTS `pre_admin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(200) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `salt` varchar(150) DEFAULT NULL COMMENT '密码盐',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `email` varchar(150) DEFAULT NULL COMMENT '邮箱',
  `register_time` int(11) DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='管理员表' AUTO_INCREMENT=28 ;

--
-- 转存表中的数据 `pre_admin`
--

INSERT INTO `pre_admin` (`id`, `username`, `password`, `salt`, `avatar`, `email`, `register_time`) VALUES
(5, 'admin', '9e1f29869fecefc025e3c9c4016d6d91', '3579ABHcfm', '', 'email123123123@.com', 1567850356);

-- --------------------------------------------------------

--
-- 表的结构 `pre_chat`
--

CREATE TABLE IF NOT EXISTS `pre_chat` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `content` text COMMENT '聊天内容',
  `createtime` int(11) DEFAULT '0' COMMENT '发送时间',
  `fromid` int(10) unsigned DEFAULT NULL COMMENT '接收人id',
  `toid` int(10) unsigned DEFAULT NULL COMMENT '发送人id',
  `status` varchar(255) DEFAULT NULL COMMENT '1已读 0未读',
  PRIMARY KEY (`id`),
  KEY `keychat_from` (`fromid`) USING BTREE,
  KEY `keychat_toid` (`toid`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='聊天记录表' AUTO_INCREMENT=81 ;

--
-- 转存表中的数据 `pre_chat`
--

INSERT INTO `pre_chat` (`id`, `content`, `createtime`, `fromid`, `toid`, `status`) VALUES
(46, 'asdasdasd', 1567481257, 2, 1, '1'),
(47, '123123123', 1567481266, 1, 2, '1'),
(48, 'asdasdasd', 1567481309, 1, 2, '1'),
(49, 'sfsdfsdfdsf', 1567481455, 1, 2, '1'),
(50, 'dffdgdfgdfgdfg', 1567481627, 1, 2, '1'),
(51, 'sdfsfdsdfsdf', 1567481636, 1, 2, '1'),
(52, 'asdasdasdasd', 1567482244, 1, 2, '1'),
(53, 'asdasdasdad', 1567482282, 1, 2, '1'),
(54, 'sdasdasdasd', 1567482300, 1, 2, '1'),
(55, '1111111', 1567482310, 1, 2, '1'),
(56, '1211111', 1567482361, 1, 2, '1'),
(57, 'asdasdasd', 1567482397, 1, 2, '1'),
(58, 'asdasdasd', 1567482419, 1, 2, '1'),
(59, 'asdasdasdasd', 1567482449, 2, 1, '1'),
(60, 'asdasdasd', 1567482477, 2, 1, '1'),
(61, 'asdasdasd', 1567482486, 2, 1, '1'),
(62, 'asdasdasd', 1567482501, 1, 2, '1'),
(63, 'asdasdasd', 1567482850, 1, 2, '1'),
(64, '123', 1567497520, 2, 1, '1'),
(65, '123123', 1567497538, 1, 2, '1'),
(66, '123213', 1567497605, 1, 2, '1'),
(67, 'mm', 1567497762, 1, 2, '1'),
(68, '123', 1567498070, 1, 2, '1'),
(69, '45', 1567498076, 2, 1, '1'),
(70, '123', 1567498101, 1, 2, '1'),
(71, '123', 1567498159, 2, 1, '1'),
(72, '兄弟', 1567498281, 1, 2, '1'),
(73, '听君一席话，胜读十年书', 1567498304, 1, 2, '1'),
(74, '啊？', 1567498330, 1, 2, '1'),
(75, '您好啊，admin2', 1567501087, 3, 1, '1'),
(76, '你是新来的', 1567501100, 3, 1, '1'),
(77, '明月几时有，把酒问青天', 1567501117, 3, 1, '1'),
(78, '若问何时把酒来，今夜把酒来言欢', 1567501154, 3, 1, '1'),
(79, '你好啊，我是新来的admin2', 1567501234, 1, 3, '1'),
(80, '123', 1567502562, 3, 1, '1');

-- --------------------------------------------------------

--
-- 表的结构 `pre_comment`
--

CREATE TABLE IF NOT EXISTS `pre_comment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `postid` int(11) unsigned NOT NULL COMMENT '帖子外键id',
  `content` varchar(255) NOT NULL COMMENT '评论内容',
  `create_time` int(11) unsigned NOT NULL COMMENT '评论时间',
  `userid` int(11) unsigned NOT NULL COMMENT '评论用户id',
  `parentid` int(11) unsigned NOT NULL COMMENT '父级id',
  `deep` int(11) unsigned NOT NULL COMMENT '层级id',
  PRIMARY KEY (`id`),
  KEY `postid` (`postid`) USING BTREE,
  KEY `userid` (`userid`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='评论表' AUTO_INCREMENT=169 ;

--
-- 转存表中的数据 `pre_comment`
--

INSERT INTO `pre_comment` (`id`, `postid`, `content`, `create_time`, `userid`, `parentid`, `deep`) VALUES
(1, 1, '秀儿，别跑', 123, 1, 0, 0),
(2, 1, '拿朕的镇国宝刀给秀儿砸个核桃', 455, 2, 1, 1),
(3, 1, '秀儿东山再起，一举雄风', 64352355, 1, 2, 2),
(4, 7, '兄弟，上辈子积了福哦，(●''◡''●)', 0, 1, 0, 0),
(121, 16, '爱你哦，兔子，么么哒', 1567919925, 1, 0, 0),
(122, 15, '您好', 1567921175, 2, 0, 0),
(123, 15, '2楼', 1567921181, 2, 0, 0),
(124, 15, '3楼', 1567921185, 2, 0, 0),
(125, 15, '4楼', 1567921191, 2, 0, 0),
(126, 15, '5楼', 1567921194, 2, 0, 0),
(127, 15, '蹭1楼', 1567921266, 2, 122, 1),
(128, 15, '蹭一楼的1楼', 1567921286, 2, 122, 2),
(129, 15, '蹭1楼中的1楼', 1567921301, 2, 122, 3),
(131, 15, '蹭1楼 1楼 1楼', 1567921556, 2, 122, 4),
(132, 15, '蹭1楼1楼1楼1楼', 1567921575, 2, 122, 5),
(133, 15, '蹭1楼中的2楼', 1567921599, 2, 122, 4),
(134, 15, '蹭一楼的2楼', 1567921653, 2, 122, 2),
(135, 7, '兄弟，', 1567921731, 2, 4, 1),
(136, 15, '3楼中的1楼', 1567921750, 2, 124, 1),
(137, 15, '3楼中的1楼中的1楼', 1567921764, 2, 124, 2),
(138, 15, '3楼中的1楼中的1楼中的1楼', 1567921774, 2, 124, 3),
(139, 15, '3楼中的1楼中的2楼', 1567921782, 2, 124, 3),
(140, 15, '3楼中的1楼中的3楼', 1567921798, 2, 124, 3),
(141, 15, '天哪撸，居然是4楼', 1567921811, 2, 126, 1),
(142, 15, '我的天啊', 1567921817, 2, 126, 2),
(143, 15, '你让我一个5楼怎么活', 1567921831, 2, 126, 1),
(152, 15, '5楼？？？', 1567923024, 2, 126, 1),
(153, 15, '6楼，呵呵', 1567923142, 2, 0, 0),
(154, 15, '赞5楼', 1567923156, 2, 126, 1),
(155, 15, '5楼你好啊', 1567923259, 2, 126, 1),
(156, 15, '5楼你好啊2', 1567923330, 2, 126, 1),
(157, 15, '6楼你啊', 1567923385, 2, 153, 1),
(158, 15, '6楼哦', 1567923526, 2, 153, 1),
(159, 15, '6楼你真骚', 1567923609, 2, 153, 1),
(160, 15, '6楼真绿', 1567923660, 2, 153, 1),
(161, 15, '打破4楼没人回复', 1567923683, 2, 125, 1),
(162, 15, '4楼 2楼', 1567923921, 2, 125, 1),
(163, 15, '蹭2楼哦', 1567923932, 2, 123, 1),
(164, 7, '先生', 1567924044, 2, 0, 0),
(165, 7, '你好绿', 1567924048, 2, 0, 1),
(166, 7, '何和', 1567924051, 2, 0, 2),
(167, 7, '啊啊', 1567924055, 2, 0, 1),
(168, 7, '好喜欢你？', 1567924060, 2, 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `pre_post`
--

CREATE TABLE IF NOT EXISTS `pre_post` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userid` int(11) unsigned NOT NULL COMMENT '用户id',
  `create_time` int(11) NOT NULL COMMENT '发表时间',
  `content` text NOT NULL COMMENT '内容',
  `pics` varchar(255) NOT NULL COMMENT '图集',
  `thumbup` text NOT NULL COMMENT '点赞',
  `count` int(11) NOT NULL COMMENT '浏览次数',
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='帖子表' AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `pre_post`
--

INSERT INTO `pre_post` (`id`, `userid`, `create_time`, `content`, `pics`, `thumbup`, `count`) VALUES
(1, 3, 1567749799, '说点什么吧...', '/uploads/ZjY7MDtzzwCnsQntcWbIUx3B.jpg', '0', 0),
(2, 3, 1567749996, '今天在路边捡到5分钱，很开心', '/uploads/hswTwBq-WNB4Jvb0aDqZ2aFN.jpg', '2', 0),
(5, 3, 1567750689, '说点什么吧...', '/uploads/i8LKZyWCRJ4SRPaCI4SDa9Vb.jpg,/uploads/fYQj9KdTo2fd77zWayiyArGI.jpg,/uploads/JMQr7f5L4Md1ovX3_D10XvFB.jpg,/uploads/lyV6MV8WTMrEtlXNUmGDqHIc.jpg', '3,1,2', 0),
(6, 3, 1567750754, '今天扶老奶奶过马路，然后被碰瓷了？', '', '3,1,2', 0),
(7, 1, 1567771361, '今天扶老奶奶过马路，然后被碰瓷了？', '', '3', 9),
(15, 1, 1567848918, '说点什么吧...', '/uploads/qCuTVctrHHlzd6k54Nk6jSp9.jpg', '1,2', 9),
(16, 2, 1567919854, '我是兔子', '/uploads/D7s824VAVid3d9eLeWKtmHgx.jpg', '1,2', 9);

-- --------------------------------------------------------

--
-- 表的结构 `pre_setting`
--

CREATE TABLE IF NOT EXISTS `pre_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='网站设置表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `pre_setting`
--

INSERT INTO `pre_setting` (`id`, `name`, `title`, `value`) VALUES
(1, 'logo', '网站Logo', 'public/logo.jpg'),
(2, 'flags', '热门标签', '[{ "name": "hot","value": "热门"},{"name": "new","value": "最新"}, {"name": "top","value": "置顶" } ]'),
(3, 'webname', '网站名称', '爱聊天网'),
(4, 'copyright', '网站版权', 'Copyright @ baidu.com');

-- --------------------------------------------------------

--
-- 表的结构 `pre_user`
--

CREATE TABLE IF NOT EXISTS `pre_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(150) DEFAULT NULL COMMENT '密码',
  `salt` varchar(100) DEFAULT NULL COMMENT '密码盐',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `createtime` int(11) DEFAULT NULL COMMENT '注册时间',
  `status` int(11) DEFAULT '0' COMMENT '0邮箱未验证，1邮箱已验证',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用户表' AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `pre_user`
--

INSERT INTO `pre_user` (`id`, `username`, `password`, `salt`, `avatar`, `email`, `createtime`, `status`) VALUES
(1, 'demo', '292b345f622fff1080d481685f48ae23', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/4W21eD2VfQt_6_eTcbn-f_Kp.jpg', '790891601@qq.com', 1567044588, 1),
(2, 'admin', '292b345f622fff1080d481685f48ae23', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/kx4k5NlOT91Vri4D1RAtIpOI.jpg', '790891601@qq.com', 1567044588, 1),
(3, 'admin2', '292b345f622fff1080d481685f48ae23', 'bNYcjGrJsA8n6tpYnhFd', '/uploads/TyHnq_9KZXKStdNwRBFYuLZH.jpg', '790891601@qq.com', 1567044588, 1);

-- --------------------------------------------------------

--
-- 表的结构 `pre_user_friends`
--

CREATE TABLE IF NOT EXISTS `pre_user_friends` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `friend` int(10) unsigned DEFAULT NULL COMMENT '好友id',
  `userid` int(10) unsigned DEFAULT NULL COMMENT '所属用户id',
  `groupid` int(10) unsigned DEFAULT NULL COMMENT '所属的分组',
  `createtime` int(11) DEFAULT '0' COMMENT '添加时间',
  `content` varchar(255) DEFAULT NULL COMMENT '验证信息',
  `status` int(255) DEFAULT NULL COMMENT '0未通过 1已通过 2已拒绝',
  PRIMARY KEY (`id`),
  KEY `keyfriends_groupid` (`groupid`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='好友表' AUTO_INCREMENT=8 ;

--
-- 转存表中的数据 `pre_user_friends`
--

INSERT INTO `pre_user_friends` (`id`, `friend`, `userid`, `groupid`, `createtime`, `content`, `status`) VALUES
(1, 2, 1, 4, 0, NULL, 1),
(3, 1, 2, 5, 1567667569, '您好, 我是admin，想跟和你交个朋友', 1),
(4, 2, 3, 6, 1567731143, '您好, 我是admin2，想跟和你交个朋友', 1),
(5, 3, 2, 5, 1567731341, NULL, 1),
(7, 1, 3, 6, 1567731823, '您好, 我是admin2，想跟和你交个朋友', 0);

-- --------------------------------------------------------

--
-- 表的结构 `pre_user_group`
--

CREATE TABLE IF NOT EXISTS `pre_user_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) DEFAULT NULL COMMENT '分组名称',
  `userid` int(10) unsigned DEFAULT NULL COMMENT '所属用户',
  PRIMARY KEY (`id`),
  KEY `keygroup_userid` (`userid`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='分组表' AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `pre_user_group`
--

INSERT INTO `pre_user_group` (`id`, `name`, `userid`) VALUES
(1, '朋友', 1),
(2, '家人', 1),
(3, '同学', 1),
(4, '小怪兽', 1),
(5, '笔芯', 2),
(6, '管理员', 3);

--
-- 限制导出的表
--

--
-- 限制表 `pre_chat`
--
ALTER TABLE `pre_chat`
  ADD CONSTRAINT `forignchat_fromid` FOREIGN KEY (`fromid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `forignchat_toid` FOREIGN KEY (`toid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- 限制表 `pre_comment`
--
ALTER TABLE `pre_comment`
  ADD CONSTRAINT `foreign_comment_postid` FOREIGN KEY (`postid`) REFERENCES `pre_post` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `foreign_comment_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- 限制表 `pre_post`
--
ALTER TABLE `pre_post`
  ADD CONSTRAINT `foreign_post_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- 限制表 `pre_user_friends`
--
ALTER TABLE `pre_user_friends`
  ADD CONSTRAINT `forignfriends_groupid` FOREIGN KEY (`groupid`) REFERENCES `pre_user_group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- 限制表 `pre_user_group`
--
ALTER TABLE `pre_user_group`
  ADD CONSTRAINT `forigngroup_userid` FOREIGN KEY (`userid`) REFERENCES `pre_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
