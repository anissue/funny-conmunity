var express = require('express');
var weibo   = require('./middlewares/wb_auth');
var qq      = require('./controllers/qq');
var user    = require('./controllers/user');
var post    = require('./controllers/post');
var auth    = require('./controllers/auth');
var router  = express.Router();
var config  = require('./config');


router.get('/', function (req, res, next) {
	res.render('index', {
		user: req.user,
		config: config
	});
});

router.get('/user/new', user.new);
router.get('/user/login', user.login);

router.get('/post/up', post.upload);

router.get('/user/edit', user.edit);


router.get('/user/edit', function (req, res, next) {

	res.render('./user/edit', {
		user: req.user
	});
});

router.use('/uploadredirect', function (req, res, next) {
	res.send('ahhhhh');
});


router.get('/user/out', user.out);

// 微博登录进入
router.get('/auth/wb', auth.wbSign);

// qq登录进入
router.get('/auth/qq', auth.qqSign);

module.exports = router;