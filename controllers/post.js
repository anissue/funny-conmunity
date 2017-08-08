var config = require('../config');
var tools  = require('../api/tools');
var fmdb   = require('../fmdb');
var topic_passed = fmdb.topic_passed;

exports.upload = upload;  // 上传帖子
exports.pass   = pass;    // 审核帖子
exports.index  = index;   // 展示首页
exports.week   = week;    // 周榜
exports.month  = month;   // 月榜
exports.topic  = topic;   // 展示某个帖子

function index (req, res, next) {
	var option = {
		condition: {},
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/p', // 跳转的地址头
			config: config,
			title: config.title,
			subfield: 0
		});
	});
}

function week (req, res, next) {
	var option = {
		condition: {create_date: {$gte: tools.toTime(7)}},
		sort: {like_count: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/week/p', // 跳转的地址头
			config: config,
			title: config.title,
			subfield: 1
		});
	});
}

function month (req, res, next) {
	var option = {
		condition: {create_date: {$gte: tools.toTime(30)}},
		sort: {like_count: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		res.render('index', {
			user: req.user,
			topic: item.topic,
			count: item.topic_count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/month/p', // 跳转的地址头
			config: config,
			title: config.title,
			subfield: 2
		});
	});
}

function upload (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');
	res.render('./post/upload', {
		user: req.user,
		config: config,
		title: '上传图片'
	});
}

function pass (req, res, next) {
	res.render('./post/pass', {
		user: req.user,
		config: config,
		title: '审核图片'
	});
}

// 展示某个帖子
function topic(req, res, next) {
	var option = {
		condition: {_id: req.params.topic},
		userInfo: req.user.info
	};
	topic_passed.getTopicById (option, function (err, item) {
		if (err) return next(err);
		res.render('./user/topic', {
			user: req.user,
			topic: item.topic,
			topic_count: item.count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			author: item.topic[0].author,
			config: config,
			title:  item.topic[0].title
		})
	});
}