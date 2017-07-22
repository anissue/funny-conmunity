var User = require('../models').User;

// 新用户
exports.new = function (req, res, next) {

	res.render('./user/new.html', {
		user: req.user,
		info: req.session.temInfo
	});
};

// 站内登录
exports.login = function (req, res, next) {

	res.render('./user/login.html', {
		user: req.user
	});
};

// 修改用户资料
exports.edit = function (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');

	User.openInfoOneUser({token: token}, function(err, result) {
		if (err) return next(err);

		if (result.length < 1) return  res.redirect('/user/login');
		res.render('./user/edit', {
			user: req.user,
			info: result[0]
		});
	});
};

// 退出登录
exports.out = function (req, res, next) {
	req.session.destroy();
	res.redirect('/');
};