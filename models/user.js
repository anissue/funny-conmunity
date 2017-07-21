var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var crypto   = require('crypto');
var config   = require('../config');

var UserSchema = new Schema({
	loginname: {type: String},
	password: {type: String},
	description: {type: String},
	avatar: {type: String},
	email: {type: String},

	type: {type: String},
	token: {type: String},

	weiboid: {type: String},
	qqid: {type: String},
	postCount: {type: Number},
	replyCount: {type: Number}
});

UserSchema.statics.legal = function (user) {

	if (!user.loginname || !user.password || !user.email) {
		return {states: -1, desc: '请填写完整!'};
	}

	if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(user.email)) {
		return {states: -2, desc: '邮箱格式不正确!'}
	}

	return {states: 1, desc: '合法'};
};


// 创建 token
UserSchema.statics.createToken = function () {
	var token = new Date().getTime() + config.token_secret + Math.random();
	var hash = crypto.createHash('md5');
	hash.update(token);
	return hash.digest('hex');
};

// 加密密码
UserSchema.statics.cryptoPassword = function (pwd) {
	pwd = pwd + config.password_secret;
	var hash = crypto.createHash('md5');
	hash.update(pwd);
	return hash.digest('hex');
};

//

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({token: 1}, {unique: true});
module.exports = UserSchema;