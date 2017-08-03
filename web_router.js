var express = require('express');
var weibo   = require('./middlewares/wb_auth');
var user    = require('./controllers/user');
var post    = require('./controllers/post');
var auth    = require('./controllers/auth');
var router  = express.Router();
var config  = require('./config');


router.get('/', post.index);
router.get('/p/:page', post.index);
router.get('/post/up', post.upload);
router.get('/post/pass', post.pass);


router.get('/user/new', user.new);
router.get('/user/login', user.login);

// 修改用户资料的页面
router.get('/user/edit', user.edit);

// 微博登录进入
router.get('/auth/wb', auth.wbSign);

// qq登录进入
router.get('/auth/qq', auth.qqSign);

// 退出登录
router.get('/user/out', user.out);

// 这个页面主要是用于通过iframe框架的地址来传递值！
router.use('/uploadredirect', function (req, res, next) {
	res.send('helloWorld!');
});

module.exports = router;