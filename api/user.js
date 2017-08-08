var path       = require('path');
var tools      = require('./tools');
var uploadImg  = require('./upload_img');
var config     = require('../config');
var User       = require('../models').User;
var fmdb       = require('../fmdb');
var user       = fmdb.user;

exports.new   = newUser;   // 创建新用户
exports.login = login;     // 站内登录
exports.edit  = edit;      // 修改资料
exports.isLogin = isLogin; // 返回登陆状态
exports.uploadAvatar = uploadAvatar; // 上传头像

// 创建新用户
function newUser (req, res, next) {

	// 查看数据是否合法
	var data = req.body;
	var legal = User.legal(data);

	if (legal.states !== 1) return res.json(legal);
	if (req.session.tempInfo === undefined || req.session.tempInfo === null) {
		data.type = 'dnd';
		data.avatar = 'default/' + parseInt(Math.random() * config.avatar_default_count  + 1) + '.jpg';
	} else {
		data.type = req.session.tempInfo.type ;
		data.avatar = req.session.tempInfo.avatar;
	}

	data.token = User.createToken();
	data.password = User.cryptoPassword(data.password);

	if (data.type === 'qq') {
		data.qqid = req.session.access.id;
	} else if (data.type === 'wb') {
		data.wbid = req.session.access.id;
	}

	req.session.tempInfo = null;
	req.session.access  = null;
	req.session.token   = data.token;

	user.createUser(data, function (msg) {
		return res.json(msg);
	});
}

// 站内登录
function login (req, res, next) {
	var data = {
		loginname: req.body.loginname,
		password:  User.cryptoPassword(req.body.password)
	};
	user.login(data, function (token, msg) {
		if (token) {
			req.session.token = token;
		}
		res.json(msg);
	});
}

// 上传图片 上传头像使用 ifream 来传值
function uploadAvatar (req, res, next) {
	var token = req.session.token;
	user.getUserByToken(token, function (err, result) {
		if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

		if (result.length < 1) tools.parseRedirect({ states: -6, hint  : 'token已过期', data  : '' }, res);

		return uploadImg.saveLocal(req, res, next, {
			maxSize: 1024 * 1024,
			fileName: result[0].loginname,
			dir: path.join(__dirname, '..', 'avatar')
		}, function (userFileName) {
			// 更新头像地址
			User.update({token: token}, {$set: {avatar: userFileName}}, function (err, result) {
				if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);
				var url = encodeURIComponent('/avatar/' + userFileName) + '?t=' + new Date().getTime();
				return tools.parseRedirect({ states: 1, hint  : '头像上传完成', data  : url}, res);
			});
		});
	});
}

// 修改资料
function edit (req, res, next) {
	var data = {
		description: req.body.description,
		qq: req.body.qq,
		wb: req.body.wb
	};
	if (data.description.length > 150 || data.qq.length > 100 || data.wb.length > 100) {
		return res.json({ states: -2, hint  : '数据有误' });
	}
	if (data.qq) {
		if (data.qq.indexOf('qq.com') === -1) {
			data.qq = 'https://user.qzone.qq.com/' + data.qq;
		}
	}
	if (data.wb) {
		if (data.wb.indexOf('weibo.com') === -1) {
			return res.json({ states: -2, hint  : '微博链接不是这样的吧 QAQ!' });
		}
	}
	var token = req.session.token;

	user.edit({token: token}, data, function (msg) {
		res.json(msg);
	});
}

// 返回登录状态
function isLogin (req, res, next) {
	var token = req.session.token;
	user.getUserByToken(token, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' });

		if (result.length < 1) return res.json({ states: -2, hint  : 'token过期' });
		return res.json({ states: 1, hint  : '登录', data: result[0] });
	});
}