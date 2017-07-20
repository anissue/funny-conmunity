var express = require('express');

var router  = express.Router();

router.get('/', function (req, res, next) {
	res.render('index', {
		config: {
			state_login: true
		}
	});
});

router.get('/user/new', function (req, res, next) {
	res.render('./user/new', {
		config: {
			state_login: true
		}
	});
});

router.get('/post/up', function (req, res, next) {
	res.render('./post/upload', {
		config: {
			state_login: true
		}
	});
});

router.get('/user/edit', function (req, res, next) {
	res.render('./user/edit', {
		config: {
			state_login: true
		}
	});
});


router.get('/user/edit', function (req, res, next) {
	res.render('./user/edit', {
		config: {
			state_login: true
		}
	});
});


// 需要过滤掉系统关键词
router.get('/user/:name', function (req, res, next) {
	res.render('./user/index', {
		config: {
			state_login: true
		}
	});
});

module.exports = router;