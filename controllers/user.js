var User = require('../models').User;
var config = require('../config');

// 新用户
exports.new = function (req, res, next) {
	res.render('./user/new.html', {
		user: req.user,
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

// 退出登录
exports.out = function (req, res, next) {
	req.session.destroy();
	res.redirect('/');
};