var config = require('../config');
var TopicPassed = require('../models').TopicPassed;
var User   = require('../models').User;

// 上传帖子
exports.upload = function (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');

	res.render('./post/upload', {
		user: req.user
	});
};


// 审核帖子
exports.pass = function (req, res, next) {
	res.render('./post/pass', {
		user: req.user,
		config: config
	});
};

// 展示首页
exports.index = function (req, res, next) {
	newTopic(function (err, topic) {
		res.render('index', {
			user: req.user,
			topic: topic,
			config: config
		});
	});


};

// 获取最新的帖子
function newTopic (callback) {
	TopicPassed.find({}).sort({create_date: -1}).exec(function (err, result) {
		if (err) return callback(err, null);
		if (result.length < 1) return callback(null, []);
		getTopic(result, callback);
	});
}

// 组成帖子的数据
function getTopic (topic, callback) {
	var topicData = [];
	(function iteration(i) {
		if (i >= topic.length) {
			callback(null, topicData);
			return;
		}

		User.openInfoOneUser({_id: topic[i].author_id}, function (err, result) {
			if (err) return callback(err, null);
			topic[i].author = result[0];
			topicData.push(topic[i]);
			iteration(++i);
		});
	})(0)
}