
var path       = require('path');
var config     = require('../config');
var uploadImg  = require('./uploadImg');
var tools      = require('./tools');
var ObjectId   = require('mongoose').Types.ObjectId;
var User       = require('../models').User;
var Topic      = require('../models').Topic;
var TopicPassed= require('../models').TopicPassed;
var Reply      = require('../models').Reply;


// 上传帖子图片的不能使用 授权 的中间件，上传机制是通过地址传值得
exports.uploadImg = function (req, res, next) {

    var token = req.session.token;
    User.find({token: token}, function (err, result) {
        if (err) return tools.parseRedirect({ states: -1, hint  : '服务器错误', data  : '' }, res);

        if (result.length < 1) return tools.parseRedirect({ states: -6, hint  : '请登录后在进行操作!', data  : '' }, res);

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

	topic.author_id = ObjectId(req.user._id);
	Topic.create(topic, function (err, result) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' });
		return  res.json({ states: 1, hint  : '投稿成功!'});
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

// 给一条帖子留言
exports.addReply = function (req, res, next) {
	var condition = {
		_id: req.body._id
	};
	var replyData = {
		content: req.body.content,
		reply_id: req.user._id,
		topic_id: req.body._id
	};

	// 检验数据是否合法
	var legal = Reply.legal(replyData);
	if (legal.states < 1) {
		return legal;
	}

	TopicPassed.find(condition, function (err, topic) {
		if (err) return res.json({ states: -1, hint  : '服务器错误' });
		if (topic.length < 1) return res.json({ states: -2, hint  : '找不到该帖子' });

		Reply.create(replyData, function (err, reply){
			if (err) return res.json({ states: -1, hint  : '服务器错误' });
			TopicPassed.update({_id: req.body._id}, {$inc: {reply_count: 1}}, function (err, result) {
				if (err) return res.json({ states: -1, hint  : '服务器错误' });
				return res.json({ states: 1, hint  : '评论成功！', _id: reply._id });
			});
		});
	});
};

// 获取一条帖子的留言
exports.getReply = function (req, res, next) {
    var condition = {
		topic_id: req.body._id
    };
    Reply.find(condition, function (err, reply) {
        if (err) return res.json({ states: -1, hint: '服务器错误' });
        var replyData = [];
        (function iteration(i) {
            if (i >= reply.length) {
                return res.json({ states: 1, hint: '成功!', data: replyData });
            }
            User.openInfoOneUser({
                _id: reply[i].reply_id
            }, function (err, user) {
				if (err) return res.json({ states: -1, hint: '服务器错误' });
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
				replyData.push(tempData);
                iteration(++i);
            });
        })(0)
    });
};

// 增加一个喜欢
exports.like = function (req, res, next) {
	var condition = {
		_id: req.body._id,
		liker_id: req.user._id
	};
	TopicPassed.find(condition, function (err, topic) {
		if (err) return res.json({ states: -1, hint: '服务器错误' });
		if (topic.length > 0) return res.json({ states: -2, hint: '已经赞过咯' });

		var like_count = parseInt(Math.random() * config.like + 1);

		TopicPassed.update({_id: req.body._id}, {$inc: {like_count: like_count}, $push: {liker_id: ObjectId(req.user._id)}}, function (err, result) {
			if (err) return res.json({ states: -1, hint: '服务器错误' });

			return res.json({ states: 1, hint: '成功!' });
		});
	});
};

// 给一条评论点赞
exports.likeReply = function (req, res, next) {
	var condition = {
		_id: req.body._id,
		liker_id: req.user._id
	};
	Reply.find(condition, function (err, reply) {
		if (err) return res.json({ states: -1, hint: '服务器错误' });
		if (reply.length > 0) return res.json({ states: -2, hint: '已经赞过咯' });

		Reply.update({_id: req.body._id}, {$inc: {like_count: 1}, $push: {liker_id: ObjectId(req.user._id)}}, function (err, result) {
			if (err) return res.json({ states: -1, hint: '服务器错误' });

			return res.json({ states: 1, hint: '成功!' });
		});
	});

};