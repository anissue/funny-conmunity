var path       = require('path');
var tools      = require('./tools');
var uploadImg  = require('./uploadImg');
var User       = require('../models').User;

// 创建新用户
exports.new = function (req, res, next) {

	// 查看数据是否合法
	var data = req.body;
	var legal = User.legal(data);

	if (legal.states !== 1) return res.json(legal);
	if (req.session.tempInfo === undefined || req.session.tempInfo === null) {
		data.type = 'dnd';
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
	User.create(data, function (err) {
		if (err) return res.json({ states: -3, hint: '用户名已存在'});
		return res.json({ states: 1, 'hint': '成功' });
	});
};

// 站内登录
exports.login = function (req, res, next) {
	var data = {
		loginname: req.body.loginname,
		password:  User.cryptoPassword(req.body.password)
	};
	User.find(data, function (err, result) {
		if (err) next(err);
		if (result < 1) return res.json({ states: -4, hint: '账号或密码错误'});

		var token = User.createToken();
		User.update(data, {$set: {token: token}}, function (err, result){
			if (err) return next(err);
			req.session.token = token;
			return res.json({ states: 1, hint: '成功'});
		});
	});
};

// 上传图片
// 上传头像需要使用到 ifream 技术来获得返回值 所以只能重定向
// 以前使用其他语言做过很多爬虫，从中得到结论永远不要相信传过来的数据
exports.uploadAvatar = function (req, res, next) {
	var token = req.session.token;
	User.find({token: token}, function (err, result) {
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

				return tools.parseRedirect({ states: 1, hint  : '头像上传完成', data  :  userFileName}, res);
			});
		});
	});
};

// 修改资料
exports.edit = function (req, res, next) {
	var data = {
		description: req.body.description,
		qq: req.body.qq,
		wb: req.body.wb
	};
	if (data.description.length > 150 || data.qq.length > 100 || data.wb.length > 100) {
		return res.json({ states: -2, hint  : '数据有误' });
	}
	var token = req.session.token;
	User.find({token: token}, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' });

		if (result.length < 1) return res.json({ states: -2, hint  : 'token过期' });


		User.update({token: token}, {$set: data}, function (err, result) {
			if (err) return res.json({ states: -1, hint  : '服务器错误' });

			return res.json({ states: 1, hint  : '更新成功' });
		});

	});
};

// 返回登录状态
exports.isLogin = function (req, res, next) {
	var token = req.session.token;
	User.find({token: token}, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' });

		if (result.length < 1) return res.json({ states: -2, hint  : 'token过期' });
		return res.json({ states: 1, hint  : '登录' });
	});
};



/*exports.uploadAvatar = function (req, res, next) {
 var token = req.session.token;
 // 放头像的文件夹
 var avatarDir =  path.join(__dirname, '..', 'avatar');
 User.find({token: token}, function (err, result) {
 if (err) return parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

 if (result.length < 1) parseRedirect({ states: -6, hint  : 'token已过期', data  : '' }, res);

 var form = formidable.IncomingForm();

 form.uploadDir = avatarDir;
 form.keepExtensions = true;

 form.parse(req, function (err, fields, file) {
 if (err)
 return parseRedirect({states: -1, hint: '服务器错误', data: ''}, res);

 if (file.avatar === undefined)
 return parseRedirect({ states: -2, hint  : '上传的东东错误', data  : '' }, res);

 file = file.avatar;

 if (file.size > 1024 * 1024) {
 fs.unlink(file.path, function (err) {
 return parseRedirect({ states: -3, hint  : '头像超过1m', data  : '' }, res);
 });
 }

 var type = ['image/png','image/jpeg','image/gif'];
 if (type.indexOf(file.type) === -1) {
 fs.unlink(file.path, function (err) {
 return parseRedirect({ states: -4, hint  : '图片类型不正确', data  : '' }, res);
 });
 }

 // 新文件名
 var userFileName =   path.join(result[0].loginname + path.extname(file.name));
 fs.rename(file.path, path.join(avatarDir, userFileName), function (err) {
 if (err) return parseRedirect({ states: -5, hint  : '图片地址有误', data  : '' }, res);

 // 更新头像地址
 User.update({token: token}, {$set: {avatar: userFileName}}, function (err, result) {
 if (err) return parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

 return parseRedirect({ states: 1, hint  : '头像上传完成', data  :  userFileName}, res);
 });
 });

 });
 });
 };*/