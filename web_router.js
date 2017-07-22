var express = require('express');
var weibo   = require('./middlewares/wb_auth');
var qq      = require('./controllers/qq');
var user    = require('./controllers/user');
var auth    = require('./controllers/auth');
var router  = express.Router();



router.get('/', function (req, res, next) {
	res.render('index', {
		user: req.user
	});
});

router.get('/user/new', user.new);
router.get('/user/login', user.login);

router.get('/post/up', function (req, res, next) {
	res.render('./post/upload', {
		user: req.user
	});
});

router.get('/user/edit', user.edit);


router.get('/user/edit', function (req, res, next) {
	res.render('./user/edit', {
		user: user
	});
});

router.use('/uploadredirect', function (req, res, next) {
	res.send('ahhhhh');
});

router.get('/user/out', user.out);

// // 需要过滤掉系统关键词
// router.get('/user/:name', function (req, res, next) {
//
// 	res.render('./user/index', {
// 		user: user
// 	});
// });

router.get('/auth/wb', auth.wbSign);

// qq登录进入
router.get('/auth/qq', auth.qqSign);

module.exports = router;