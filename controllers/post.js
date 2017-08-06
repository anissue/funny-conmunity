var config = require('../config');
var tools  = require('../api/tools');
var fmdb   = require('../fmdb');
var rank   = fmdb.rank;
var topic_passed = fmdb.topic_passed;

exports.upload = upload;  // 上传帖子
exports.pass   = pass;    // 审核帖子
exports.index  = index;   // 展示首页
exports.week   = week;    // 周榜
exports.month  = month;   // 月榜


function upload (req, res, next) {
	var token = req.session.token;
	if (token === undefined) return res.redirect('/user/login');

	res.render('./post/upload', {
		user: req.user,
		config: config
	});
}

function pass (req, res, next) {
	res.render('./post/pass', {
		user: req.user,
		config: config
	});
}

function index (req, res, next) {
	var option = {
		condition: {},
		sort: {create_date: -1},
		page: req.params.page || 1,
		userInfo: req.user.info
	};
	topic_passed.getTopic(option, function (err, item) {
		if (err) return next(err);
		config.subfield = 0;
		res.render('index', {
			user: req.user,
			topic: item.topic,
			topic_count: item.count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/p', // 跳转的地址头
			config: config
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
		config.subfield = 1;
		res.render('index', {
			user: req.user,
			topic: item.topic,
			topic_count: item.count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/week/p', // 跳转的地址头
			config: config
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
		config.subfield = 2;
		res.render('index', {
			user: req.user,
			topic: item.topic,
			topic_count: item.count,
			user_rank: item.user_rank,
			topic_rank: item.topic_rank,
			paging: option.page,
			paging_link: '/month/p', // 跳转的地址头
			config: config
		});
	});
}