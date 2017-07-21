var express = require('express');
var weibo   = require('./middlewares/weibo_auth');
var qq      = require('./controllers/qq');
var user    = require('./controllers/user');
var router  = express.Router();



router.get('/', function (req, res, next) {
	res.render('index', {
		user: req.user
	});
});

router.get('/user/new', user.new);

router.get('/post/up', function (req, res, next) {
	res.render('./post/upload', {
		user: req.user
	});
});

router.get('/user/edit', function (req, res, next) {
	res.render('./user/edit', {
		user: req.user
	});
});


router.get('/user/edit', function (req, res, next) {
	res.render('./user/edit', {
		user: user
	});
});


// // 需要过滤掉系统关键词
// router.get('/user/:name', function (req, res, next) {
//
// 	res.render('./user/index', {
// 		user: user
// 	});
// });

router.get('/auth/wb', function (req, res, next) {
	weibo.getAccessToken(req.query.code, function (err, access) {
		weibo.getInfo(access, function (err, info) {
			res.send(info);
		});
	});
});

// qq登录进入
router.get('/auth/qq', qq.sign);

module.exports = router;