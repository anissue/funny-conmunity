var express = require('express');
var router  = express.Router();
var User    = require('../models').User;

// 给所有的请求添加一个公共的头，用来记录用户登录状态
exports.authUser = function (req, res, next) {
	req.user = {state_login: false};
	if (req.session.token) {

		User.find({token: token}, function (err, result) {
			if (err) return next(err);

			if (result.length > 0) {
				req.user.state_login = true;
				// 现在需要做的是把 用户信息添加进来 User 里面添加个静态方法，过滤掉不隐私信息
			}
		})
	}
};