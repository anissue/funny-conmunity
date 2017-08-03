var User = require('../models').User;
var config = require('../config');
var TopicPassed = require('../models').TopicPassed;
// 新用户
exports.new = function (req, res, next) {
	var user = req.user;
	user.info = req.session.tempInfo;
	res.render('./user/new.html', {
		user: user,
		config: config
	});
};

// 站内登录
exports.login = function (req, res, next) {
	res.render('./user/login.html', {user: req.user, config: config});
};

// 修改用户资料
exports.edit = function (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');

	User.openInfoOneUser({token: token}, function(err, result) {
		if (err) return next(err);

		if (result.length < 1) return  res.redirect('/user/login');
		res.render('./user/edit', {
			user: req.user
		});
	});
};

// 显示某人的主页
exports.index = function (req, res, next) {
	var name = req.params.name;
	var page = req.params.page || 1;
	User.openInfoOneUser({ loginname: name }, function (err, author) {
		if (err || author.length < 1) return next();

		// 获得用户发的帖子
		TopicPassed.find({ author_id: author[0]._id })
		.limit(config.topic_limit)
		.skip(config.topic_limit * (page - 1))
		.sort({create_date: -1})
		.exec(function (err, topic) {
			if (err) return next(err);
			for (var i = 0; i < topic.length; i++) {
				topic[i].author = author[0];
			}

			// 获取帖子总数
			TopicPassed.count({ author_id: author[0]._id }, function (err, count) {
				if (err) return next(err);
				res.render('./user/index', {
					user: req.user,
					topic: topic,
					topic_count: count,
					author: author[0],
					paging: page,
					paging_link: '/people/' + author[0].loginname, // 跳转的地址头
					config: config
				});
			});

		});
	});
	// 获取个人信息

};

// 退出登录
exports.out = function (req, res, next) {
	req.session.destroy();
	res.redirect('/');
};