var TopicPassed = require('../models').TopicPassed;
var ObjectId   = require('mongoose').Types.ObjectId;
var config = require('../config');
var user   = require('./user');
var rank   = require('./rank');
var async  = require('async');

exports.getTopic    = getTopic;    // 获得一组帖子
exports.createTopic = createTopic; // 创建一条帖子
exports.like        = like;        // 增加一个喜欢

function getTopic (option, cd) {
	async.series({
		topic: function (callback) {
			topic(option, callback);
		},
		count: function (callback) {
			count(option, callback);
		},
		user_rank: function (callback) {
			rank.user(callback);
		},
		topic_rank: function (callback) {
			rank.topic(callback);
		}
	},function (err, item) {
		cd(err, item);
	});
}

function topic (option, callback) {
	var req = option.req;
	var page = option.page;
	var sort = option.sort;
	var condition = option.condition;
	var userInfo = option.userInfo;
	TopicPassed.find(condition)
		.limit(config.topic_limit)
		.skip(config.topic_limit * (page - 1))
		.sort(sort).exec(function (err, topic) {

			if (err) return callback(err, null);

			var topicData = [];
			(function iteration(i) {
				if (i >= topic.length) {
					return callback(null, topicData);
				}
				user.getUserById(topic[i].author_id, function (err, user) {

					if (err) return callback(err, null);
					topic[i].author = user[0];
					// 是否赞过
					if (userInfo) {
						topic[i].liked = topic[i].liker_id.indexOf(userInfo._id) === -1 ? 0 : 1;
					} else {
						topic[i].liked = 0;
					}

					topicData.push(topic[i]);
					iteration(++i);
				});
			})(0)
		})
}

function count (option, callback) {
	TopicPassed.count(option.condition, function (err, count) {
		callback(err, count);
	});
}

function createTopic (topic, callback) {
	TopicPassed.create(topic, function (err, result) {
		callback(err, result);
	});
}

// 增加一个喜欢
function like (condition, callback) {
	TopicPassed.find(condition, function (err, topic) {
		if (err) return callback({ states: -1, hint: '服务器繁忙!' });
		if (topic.length > 0) return callback({ states: -2, hint: '已经赞过咯' });

		var like_count = parseInt(Math.random() * config.like + 1);

		TopicPassed.update({_id: condition._id}, {$inc: {like_count: like_count}, $push: {liker_id: ObjectId(condition.liker_id)}}, function (err, result) {
			if (err) return callback({ states: -1, hint: '服务器繁忙!' });

			return callback({ states: 1, hint: '成功!' });
		});
	});
}