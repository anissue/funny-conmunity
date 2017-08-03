
var path       = require('path');
var config     = require('../config');
var uploadImg  = require('./uploadImg');
var tools      = require('./tools');
var ObjectId   = require('mongoose').Types.ObjectId;
var User       = require('../models').User;
var Topic      = require('../models').Topic;
var TopicPassed= require('../models').TopicPassed;


// 上传图片的
exports.uploadImg = function (req, res, next) {

    var token = req.session.token;
    User.find({token: token}, function (err, result) {
        if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

        if (result.length < 1) return tools.parseRedirect({ states: -6, hint  : 'token已过期', data  : '' }, res);

        // 先把图片放在本地然后直接上传
        return uploadImg.saveLocal(req, res, next, {
            maxSize: 1024 * 1024 * 2.5,
            fileName: tools.time(),
            dir: path.join(__dirname, '..', 'avatar', 'temp')
        }, function (fileName) {
            return tools.parseRedirect({ states: 1, hint  : '上传完成', data  :  'temp%2F' + fileName}, res);

        });

    });
};

// 上传帖子
exports.uploadTopic = function (req, res, next) {

    var topic = {
        title: req.body.title,
        content: req.body.content
    };

    var legal = Topic.legal(topic);
    if (legal.states !== 1) return res.json(legal);

    var token = req.session.token;
    User.find({token: token}, function (err, result) {
        if (err) return res.json({ states: -1, hint  : '服务器错误' });

        if (result.length < 1) res.json({ states: -6, hint  : 'token已过期' });

        topic.author_id = ObjectId(result[0]._id);
        Topic.create(topic, function (err, create_result) {
            if (err) return res.json({ states: -1, hint  : '服务器错误' });
            return  res.json({ states: 1, hint  : '投稿成功!', topic_id: result[0]._id });
        });
    });
};

// 获得没有审核的帖子
exports.notpass = function (req, res, next) {
    var condition = {
        notpassed_count : {$lt: config.pass_count}
    };
    Topic.find(condition, function (err, result) {
        if (err) return res.json({ states: -1, hint  : '服务器错误' });
        result = result[parseInt(Math.random() * result.length)];
        return res.json({ states: 1, hint  : '成功！', topic: result });
    });
};

// 帖子的通过数量加一
exports.pass = function (req, res, next) {
    var condition = {
        _id: ObjectId(req.body._id)
    };
    Topic.update(condition, {$inc: {passed_count: 1}}, function (err, result) {
        if (err) return res.json({ states: -1, hint  : '服务器错误' });
		overBound(condition._id);
        return res.json({ states: 1, hint  : '成功！' });
    });
};

// 帖子不通过的数量加1
exports.notPass = function (req, res, next) {
    var condition = {
        _id: ObjectId(req.body._id)
    };
    Topic.update(condition, {$inc: {notpassed_count: 1}}, function (err, result) {
        if (err) return res.json({ states: -1, hint  : '服务器错误' });

        return res.json({ states: 1, hint: '成功！' });
    });
};

// 帖子通过的数量达到设定值时
function overBound(id) {
	Topic.find({ _id: id }, function (err, result) {
	    console.log(result.length);
        if (err || result.length < 1) return;
        result = result[0];
        if (result.passed_count >= config.pass_count) {
            var date =  new Date();
            var TopicData = {
                title: result.title,
				content: result.content,
				author_id: result.author_id,
				create_date: date,
				like_count: parseInt(Math.random() * config.start_like + 1)
            };
            // 删除以前的帖子数据
            Topic.remove({ _id: id }, function (err, result) {});

            // 加入到通过审核的帖子集合中
            TopicPassed.create(TopicData, function (err, result) {});
        }
    });
}