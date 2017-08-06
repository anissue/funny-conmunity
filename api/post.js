var path       = require('path');
var config     = require('../config');
var upload_img  = require('./upload_img');
var tools      = require('./tools');
var ObjectId   = require('mongoose').Types.ObjectId;
var fmdb       = require('../fmdb');
var user       = fmdb.user;
var topic      = fmdb.topic;
var reply      = fmdb.reply;
var topic_passed= fmdb.topic_passed;

exports.uploadImg   = uploadImg;      // 上传帖子图片
exports.uploadTopic = uploadTopic;    // 上传帖子
exports.getNotPass  = getNotPass;     // 获得没有审核的帖子
exports.notPass     = notPass;        // 帖子不通过加一
exports.allowPass   = allowPass;      // 帖子通过加一
exports.addReply    = addReply;       // 给一条帖子留言
exports.getReply    = getReply;       // 获取一条帖子的留言
exports.like        = like;           // 增加一个喜欢
exports.likeReply   = likeReply;      // 给一条评论点赞


// 上传帖子图片
function uploadImg (req, res, next) {

    var token = req.session.token;
	user.getUserByToken(token, function (err, result) {
        if (err) return tools.parseRedirect({ states: -1, hint  : '服务器繁忙!', data  : '' }, res);

        if (result.length < 1) return tools.parseRedirect({ states: -6, hint  : '请登录后在进行操作!', data  : '' }, res);

        // 先把图片放在本地然后直接上传
        return upload_img.saveLocal(req, res, next, {
            maxSize: 1024 * 1024 * 2.5,
            fileName: tools.time(),
            dir: path.join(__dirname, '..', 'picture')
        }, function (fileName) {

			if (config.qiniu.ACCESS_KEY === '') {
				return tools.parseRedirect({ states: 1, hint  : '上传完成', data  : '/picture%2f' + fileName}, res);
			}
			upload_img.qiniu(path.join(__dirname, '..', 'picture', fileName), fileName, function (respErr, respBody, respInfo){
				if (respErr) {
					return tools.parseRedirect({ states: -1, hint  : '服务器繁忙!', data  : '' }, res);
				}
				if (respInfo.statusCode == 200) {
					var url = encodeURIComponent(config.qiniu.URL + '/' + fileName + '/' + config.qiniu.URL.mark);
					return tools.parseRedirect({ states: 1, hint  : '上传完成', data  : url }, res);
				} else {
					return tools.parseRedirect({ states: -2, hint  : respBody, data  : '' }, res);
				}

			})

        });

    });
}

// 上传帖子
function uploadTopic (req, res, next) {

    var topicData = {
        title: req.body.title,
        content: req.body.content,
		author_id: ObjectId(req.user._id)
    };

	var legal = topic.legal(topicData);
	if (legal.states !== 1) return res.json(legal);

	topic.upload(topicData, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器繁忙!' });
		return  res.json({ states: 1, hint  : '投稿成功!'});
	});
}

// 获得没有审核的帖子
function getNotPass(req, res, next) {

    topic.getNotPass(function (err, topicData) {
        if (err) return res.json({ states: -1, hint  : '服务器繁忙!' });
        return res.json({ states: 1, hint  : '成功！', topic: topicData });
    });
}

// 帖子的通过数量加一
function allowPass (req, res, next) {

    topic.allowPass(ObjectId(req.body._id), function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器繁忙!' });
		return res.json({ states: 1, hint  : '成功！' });
	});
}

// 帖子不通过的数量加1
function notPass (req, res, next) {

	topic.notPass(ObjectId(req.body._id), function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器繁忙!' });
		return res.json({ states: 1, hint  : '成功！' });
	});
}

// 给一条帖子留言
function addReply (req, res, next) {
	var condition = {
		_id: req.body._id
	};
	var replyData = {
		content: req.body.content,
		reply_id: req.user._id,
		topic_id: req.body._id
	};
	// 检验数据是否合法
	var legal = reply.legal(replyData);
	if (legal.states < 1) {
		return res.json(legal);
	}

	reply.addReply(condition, replyData, function (err, reply) {
		if (err) return res.json({ states: -1, hint: '服务器繁忙!' });
		res.json({ states: 1, hint: '评论成功!',  _id: reply._id  })
	});
}

// 获取一条帖子的留言
function getReply (req, res, next) {
    var condition = {
		topic_id: req.body._id
    };
	reply.getReply(condition, req.user, function (err, result) {
		if (err) return res.json({ states: -1, hint: '服务器繁忙!' });
		return res.json({ states: 1, hint: '成功!', data: result });
	});
}

// 增加一个喜欢
function like (req, res, next) {
	var condition = {
		_id: req.body._id,
		liker_id: req.user._id
	};
	topic_passed.like(condition, function (msg) {
		res.json(msg);
	});
}

// 给一条评论点赞
function likeReply (req, res, next) {
	var condition = {
		_id: req.body._id,
		liker_id: req.user._id
	};
	reply.likeReply(condition, function (msg) {
		res.json(msg);
	});
}