var TopicPassed = require('../models').TopicPassed;
var ObjectId   = require('mongoose').Types.ObjectId;
var Reply       = require('../models').Reply;
var tools       = require('../api/tools');
var user        = require('./user');
var config = require('../config');

exports.legal    = Reply.legal;   // 检测数据合法
exports.addReply = addReply;      // 增加一条评论
exports.getReply = getReply;      // 获得帖子的评论
exports.likeReply = likeReply;    // 给一条评论点赞
exports.getReplyByUserId = getReplyByUserId; // 通过用户id获取评论

// 增加一条评论
function addReply (condition, replyData, callback) {

	TopicPassed.find(condition, function (err, topic) {
		if (err) return callback(err, null);
		if (topic.length < 1) return callback(true, null);

		Reply.create(replyData, function (err, reply){
			if (err) return callback(err, null);
			TopicPassed.update({_id: replyData.topic_id}, {$inc: {reply_count: 1}}, function (err, result) {
				if (err) return callback(err, null);
				return callback(null, reply);
			});
		});
	});
}

// 获得帖子的评论
function getReply (condition, authuser, callback) {
	Reply.find(condition).exec(function (err, reply) {
		if (err) return callback(err, null);
		var replyData = [];
		(function iteration(i) {
			if (i >= reply.length) {
				return callback(null, replyData);
			}
			user.getUserById(reply[i].reply_id, function (err, user) {
				if (err) return callback(null, replyData);
				var tempData = {
					_id: reply[i]._id,
					content: tools.filterTag(reply[i].content),
					topic_id: reply[i].topic_id,
					like_count: reply[i].like_count,
					create_date: reply[i].create_date,
					name: tools.filterTag(user[0].loginname),
					avatar: user[0].avatar,
					floor: i + 1
				};
				if (authuser) {
					tempData.liked = reply[i].liker_id.indexOf(authuser._id) === -1 ? 0 : 1;
				} else {
					tempData.liked = 0;
				}
				replyData.push(tempData);
				iteration(++i);
			});
		})(0)
	});
}

// 给一条评论点赞
function likeReply (condition, callback) {
	Reply.find(condition, function (err, reply) {
		if (err) return callback({ states: -1, hint: '服务器繁忙!' });
		if (reply.length > 0) return callback({ states: -2, hint: '已经赞过咯' });

		Reply.update({_id: condition._id}, {$inc: {like_count: 1}, $push: {liker_id: ObjectId(condition.liker_id)}}, function (err, result) {
			if (err) return callback({ states: -1, hint: '服务器繁忙!' });

			return callback({ states: 1, hint: '成功!' });
		});
	});
}

// 通过用户id获取评论
function getReplyByUserId (option, callback) {
	var page      = option.page;
	var limit     = config.reply_limit;
	Reply.find({reply_id: option.reply_id}).limit(limit).skip(limit * (page - 1)).sort({create_date: -1}).exec(function (err, reply) {
		callback(err, reply);
	});
}