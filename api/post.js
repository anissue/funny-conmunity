var tools = require('./tools');
var User       = require('../models').User;
var uploadImg  = require('./uploadImg');
var path       = require('path');

exports.uploadImg = function (req, res, next) {

	var token = req.session.token;
	User.find({token: token}, function (err, result) {
		if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

		if (result.length < 1) tools.parseRedirect({ states: -6, hint  : 'token已过期', data  : '' }, res);

		// 先把图片放在本地然后直接上传
		return uploadImg.saveLocal(req, res, next, {
			maxSize: 1024 * 1024 * 2.5,
			fileName: tools.time(),
			dir: path.join(__dirname, '..', 'avatar', 'temp')
		}, function (fileName) {
			// 更新头像地址
			return tools.parseRedirect({ states: 1, hint  : '上传完成', data  :  'temp%2F' + fileName}, res);

		});

	});
};