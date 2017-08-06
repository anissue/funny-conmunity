var user  = require('../fmdb').user;

// 登录后才能进行操作的
exports.auth = function (req, res, next) {
	var token = req.session.token;
	user.getUserByToken(token, function (err, user) {
		if (err) return res.json({states: -1, hint: '服务器错误'});
		if (user.length < 1) return res.json({states: -2, hint: '请登录后在进行操作!'});
		req.user = user[0];
		next();
	});
};

// 不需要登陆也能进入
exports.tryAuth = function (req, res, next) {
	var token = req.session.token;
	user.getUserByToken(token, function (err, user) {
		if (err) return res.json({states: -1, hint: '服务器错误'});
		if (user.length < 1) return next();
		req.user = user[0];
		next();
	});
};