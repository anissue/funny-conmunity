var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var crypto   = require('crypto');
var config   = require('../config');
var tools    = require('../api/tools');

var UserSchema = new Schema({
	loginname: {type: String},
	password: {type: String},
	description: {type: String},
	avatar: {type: String, default: 'user_default.png'},
	email: {type: String},
	wb:{type: String}, // 微博联系方式
	qq:{type: String},    // qq 联系方式

	type: {type: String},
	token: {type: String},

	wbid: {type: String}, // weibo 登录 uid
	qqid: {type: String},    // qq 登录 openid
	topic_count: {type: Number},
	reply_count: {type: Number}
});

UserSchema.virtual('fullAvatar').get(function () {

	// 如果头像是QQ或者微博的头像地址就直接返回
	if (this.avatar.indexOf('http://q.qlogo.cn') !== -1 || this.avatar.indexOf('sinaimg.cn') !== -1)
		return this.avatar;
	return '/avatar/' + this.avatar;
});

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

// 验证数据
UserSchema.statics.legal = function (user) {
	user.description = user.description || '';

	if (!user.loginname || !user.password || !user.email)
		return {states: -1, hint: '请填写完整!'};

	if (tools.checkChar(user.loginname) !== 1)
		return {states: -4, hint: '昵称含有特殊字符'};

	if (user.loginname.length < 3 || user.loginname.length > 12 || user.email.length > 100 || user.description.length > 150)
		return {states: -3, hint: '数据长度不匹配'};

	if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(user.email))
		return {states: -2, hint: '邮箱格式不正确!'};

	return {states: 1, hint: '合法'};
};

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({token: 1}, {unique: true});
module.exports = UserSchema;