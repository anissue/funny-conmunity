var User        = require('../models/index').User;
var TopicPassed = require('../models/index').TopicPassed;

exports.user = user;       // 积分前5的用户
exports.topic = topic;     // 获取帖子赞数排名前4


function user(callback) {
	User.find({}).sort({topic_count: -1}).limit(5).exec(function (err, user) {
		if (err) return callback(err, []);
		for (var i = 0; i < user.length; i++) {
			user[i].avatar = user[i].fullAvatar;
		}
		callback(err, user);
	});
}

function topic(callback) {
	TopicPassed.find({}).sort({like_count: -1}).limit(4).exec(function (err, topic) {
		callback(err, topic);
	});
}