var Topic        = require('../models').Topic;
var topic_passed = require('./topic_passed');
var config       = require('../config');
var async        = require('async');

exports.legal      = Topic.legal;    // 验证数据
exports.upload     = upload;         // 上传帖子
exports.getNotPass = getNotPass;     // 获得没有通过审核的帖子
exports.allowPass  = allowPass;      // 帖子通过数量加一
exports.notPass    = notPass;        // 帖子不通过数量加一
exports.getTopicById = getTopicById; // 通过 id 获取帖子

function upload (topicData, callback) {

	Topic.create(topicData, function (err, result) {
		callback(err, result);
	})
}

function getNotPass (callback) {
	var condition = {
		notpassed_count : {$lt: config.pass_count}
	};

	Topic.find(condition, function (err, topicData) {
		if (err) return callback(err, null);
		topicData = topicData[parseInt(Math.random() * topicData.length)];
		callback(err, topicData);
	});
}

function getTopicById (id, callback) {
	Topic.find({_id: id}, function (err, topicData) {
		callback(err, topicData);
	});
}

function pass (topicId, set, callback) {
	var condition = {
		_id: topicId
	};
	async.waterfall([
		function (callback) {
			Topic.update(condition, set, function (err, result) {
				callback(err, result);
			});
		},
		function (result, callback) {
			getTopicById(topicId, callback);
		}
	], function (err, item) {
		if (err) return callback(err, null);
		overBound(item[0]);
		callback(null, item);
	});
}

function allowPass (topicId, callback) {
	pass(topicId, {$inc: {passed_count: 1}}, callback);
}

function notPass (topicId, callback) {
	pass(topicId, {$inc: {notpassed_count: 1}}, callback);
}

// 帖子通过的数量达到设定值时
function overBound(topic) {
	if (topic.passed_count >= config.pass_count) {
		var date =  new Date();
		var TopicData = {
			title: topic.title,
			content: topic.content,
			author_id: topic.author_id,
			create_date: date,
			like_count: parseInt(Math.random() * config.start_like + 1)
		};
		// 删除以前的帖子数据
		Topic.remove({ _id: topic._id }, function (err, result) {});

		// 加入到通过审核的帖子集合中
		topic_passed.createTopic(TopicData, function (err, result) {});
	}
}