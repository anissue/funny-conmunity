var config = require('../config');

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
}