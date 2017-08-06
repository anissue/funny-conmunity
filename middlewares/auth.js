var express = require('express');
var User    = require('../models').User;
var user    = require('../fmdb/user');

// 给所有的请求添加一个公共的头，用来记录用户登录状态
exports.authUser = function (req, res, next) {
	req.user = {state_login: false};
	if (req.session.token) {
		user.getUserByToken(req.session.token, function (err, result) {
			if (err) return next(err);
			if (result.length > 0) {
				req.user.state_login = true;
				req.user.info = result[0];
			}
			var state = User.createToken();
			res.cookie('state', state);
			req.user.state_code = state;
			return next();
		})
	} else if (req.cookies.state === undefined){
		var state = User.createToken();
		res.cookie('state', state);
		req.user.state_code = state;
		return next();
	} else {
		req.user.state_code = req.cookies.state;
		return next();
	}
};