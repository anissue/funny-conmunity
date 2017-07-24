var uploadImg  = require('./uploadImg');
var tools      = require('./tools');
var ObjectId   = require('mongoose').Types.ObjectId;
var User       = require('../models').User;
var Topic      = require('../models').Topic;
var path       = require('path');


// 上传图片的
exports.uploadImg = function (req, res, next) {

	var token = req.session.token;
	User.find({token: token}, function (err, result) {
		if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

		if (result.length < 1) tools.parseRedirect({ states: -6, hint  : 'token已过期', data  : '' }, res);

		// 先把图片放在本地然后直接上传
		return uploadImg.saveLocal(req, res, next, {
			maxSize: 1024 * 1024 * 2.5,
			fileName: tools.time(),
			dir: path.join(__dirname, '..', 'avatar', 'temp')
		}, function (fileName) {

			return tools.parseRedirect({ states: 1, hint  : '上传完成', data  :  'temp%2F' + fileName}, res);

		});

	});
};

// 上传帖子
exports.uploadTopic = function (req, res, next) {

	var topic = {
		title: req.body.title,
		content: req.body.content
	};

	var legal = Topic.legal(topic);
	if (legal.states !== 1) return res.json(legal);

	var token = req.session.token;
	User.find({token: token}, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' }, res);

		if (result.length < 1) res.json({ states: -6, hint  : 'token已过期' }, res);

		topic.author_id = ObjectId(result[0]._id);
		Topic.create(topic, function (err, create_result) {
			if (err) return res.json({ states: -1, hint  : '服务器错误' }, res);
			return  res.json({ states: 1, hint  : '投稿成功!', topic_id: result[0]._id });
		});
	});
};