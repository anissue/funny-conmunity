var qq   = require('../middlewares/qq_auth');
var wb   = require('../middlewares/wb_auth');
var User = require('../models').User;
var config = require('../config');

exports.index = index;

function index (req, res, next) {
	if (req.params.type === undefined) {
		console.log(1);
		return next(new Error('auth type error'));
	}
	var state = User.createToken();
	req.session.state = state;

	if (req.params.type === 'qq') {
		res.redirect('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + config.qq.ID + '&redirect_uri=' + config.qq.CALLBACK_URI + '&state=' + state);
	}

	if (req.params.type === 'wb') {
		res.redirect('https://api.weibo.com/oauth2/authorize?client_id=' + config.wb.ID + '&redirect_uri=' + config.wb.CALLBACK_URI + '&response_type=code&state=' + state);
	}

}

// qq 登录
exports.qqSign = auth.bind(qq);

// 微博 登录
exports.wbSign = auth.bind(wb);

function auth (req, res, next) {
	var This = this;
	var user = {state_login: false};
	var code = req.query.code;
	if (req.session.state !== req.query.state) {
		console.log(req.session.state, req.query.state);
		return next();
	}

	var idField = This.authType + 'id';
	This.getAccessToken(code, function (err, access) {
		if (err) return next(err);
		var condition = {};
		condition = This.authType === 'qq' ? condition = {qqid: access.id} : condition = {wbid: access.id};

		User.find(condition, function (err, result) {

			// 新用户
			if (result.length === 0) {
				// 获得授权得来信息
				This.getInfo(access, function (err, info) {
					if (err) next(err);

					// 把信息临时保存起来
					req.session.tempInfo = info;
					req.session.access = access;
					return res.redirect('/user/new');
				});
			}

			// 老用户
			if (result.length > 0) {
				// 刷新 token
				var token = User.createToken();
				User.update(condition, {$set: {token: token}}, function (err, result){
					if (err) return next(err);
					req.session.token = token;
					return res.redirect('/');
				});
			}
		});
	});
}