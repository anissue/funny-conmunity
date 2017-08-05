var config = require('../config');
var TopicPassed = require('../models').TopicPassed;
var User   = require('../models').User;
var tools  = require('../api/tools');

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
	var page = req.params.page || 1;
	getTopic({}, {create_date: -1}, req, function (err, topic, count) {
		if (err) return next();
		config.subfield = 0;
		res.render('index', {
			user: req.user,
			topic: topic,
			topic_count: count,
			paging: page,
			paging_link: '/p', // 跳转的地址头
			config: config
		});
	});
};

// 周榜
exports.week = function (req, res, next) {
	var page = req.params.page || 1;
	var condition = {
		create_date: {
			$gte: tools.toTime(7)
		}
	};
	var sort = {
		like_count: -1
	};
	getTopic(condition, sort, req, function (err, topic, count) {
		if (err) return next();
		config.subfield = 1;
		res.render('index', {
			user: req.user,
			topic: topic,
			topic_count: count,
			paging: page,
			paging_link: '/week/p', // 跳转的地址头
			config: config
		});
	});
};

// 月榜
exports.month = function (req, res, next) {
	var page = req.params.page || 1;
	var condition = {
		create_date: {
			$gte: tools.toTime(30)
		}
	};
	var sort = {
		like_count: -1
	};
	getTopic(condition, sort, req, function (err, topic, count) {
		if (err) return next();
		config.subfield = 2;
		res.render('index', {
			user: req.user,
			topic: topic,
			topic_count: count,
			paging: page,
			paging_link: '/week/p', // 跳转的地址头
			config: config
		});
	});
};

function getTopic (condition, sort, req, callback) {
	var page = req.params.page || 1;
	TopicPassed.find(condition).limit(config.topic_limit).skip(config.topic_limit * (page - 1)).sort(sort).exec(function (err, result) {
		if (err) return callback(err, null, 0);
		if (result.length < 1) return callback(null, [], 0);

		TopicPassed.count(condition, function (err, count) {
			if (err) return callback(err, [], 0);
			getAuthor(result, req, callback, count);
		});

	});
}

// 组成帖子的数据
function getAuthor (topic, req, callback, count) {
	var topicData = [];
	(function iteration(i) {
		if (i >= topic.length) {
			return callback(null, topicData, count);
		}
		User.openInfoOneUser({_id: topic[i].author_id}, function (err, result) {
			if (err) return callback(err, null, 0);
			topic[i].author = result[0];
			// 是否赞过
			if (req.user.info) {
				topic[i].liked = topic[i].liker_id.indexOf(req.user.info._id) === -1 ? 0 : 1;
			} else {
				topic[i].liked = 0;
			}

			topicData.push(topic[i]);
			iteration(++i);
		});
	})(0)
}