var fs         = require('fs');
var path       = require('path');
var tools      = require('./tools');
var formidable = require('formidable');

/*
* 图片保存在本地
* 需要传入的几个值
* {
* 	maxSize: ***,
*   dir: ***,
* 	fileName: ***,
* }
* */
exports.saveLocal = function (req, res, next, config, callback) {

	var form = formidable.IncomingForm();

	form.uploadDir = config.dir;
	form.keepExtensions = true;

	form.parse(req, function (err, fields, file) {
		if (err)
			return tools.parseRedirect({states: -1, hint: '服务器错误', data: ''}, res);

		if (file.avatar === undefined)
			return tools.parseRedirect({ states: -2, hint  : '上传的东东错误', data  : '' }, res);

		file = file.avatar;

		if (file.size > config.maxSize) {
			fs.unlink(file.path, function (err) {
				return tools.parseRedirect({ states: -3, hint  : '图片超过' + (config.maxSize / 1024) + 'm', data  : '' }, res);
			});
			return;
		}

		var type = ['image/png','image/jpeg','image/gif'];
		if (type.indexOf(file.type) === -1) {
			fs.unlink(file.path, function (err) {
				return tools.parseRedirect({ states: -4, hint  : '图片类型不正确', data  : '' }, res);
			});
			return;
		}

		// 新文件名
		// config.fileName = config.fileName || file.

		var userFileName =  config.fileName + path.extname(file.name);
		fs.rename(file.path, path.join(config.dir, userFileName), function (err) {
			if (err) return tools.parseRedirect({ states: -5, hint  : '图片地址有误', data  : '' }, res);
			callback(userFileName);
		});

	});

};
