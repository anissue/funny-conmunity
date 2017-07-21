var qq = require('../middlewares/qq_auth');
var User = require('../models').User;


// 进入的时候
exports.sign = function (req, res, next) {
	var user = {state_login: false};
	var code = req.query.code;
	qq.getAccessToken(code, function (err, access) {
		if (err) next(err);

		User.find({qqid: access.id}, function (err, result) {

			// 新用户
			if (result.length === 0) {
				// 获得qq信息
				qq.getInfo(access, function (err, info) {
					if (err) next(err);

					// 把信息临时保存起来
					req.session.temInfo = info;
					req.session.access = access;
					return res.redirect('/user/new');
				});

			}

			// 老用户
			// 刷新 token
			if (result.length > 0) {

			}
		});
	});
};