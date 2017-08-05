var express = require('express');
var weibo   = require('./middlewares/wb_auth');
var user    = require('./controllers/user');
var post    = require('./controllers/post');
var auth    = require('./controllers/auth');
var router  = express.Router();
var config  = require('./config');


router.get('/', post.index);             // 主页
router.get('/week', post.week);          // 周榜
router.get('/month', post.month);        // 月榜
router.get('/p/:page', post.index);      // 主页分页
router.get('/week/p/:page', post.week);  // 周榜分页
router.get('/month/p/:page', post.week); // 月榜分页
router.get('/post/up', post.upload);     // 上传帖子
router.get('/post/pass', post.pass);     // 审核帖子


router.get('/user/new', user.new);      // 注册新用户
router.get('/user/login', user.login);  // 站内登陆
router.get('/auth/wb', auth.wbSign);    // 微博登录
router.get('/auth/qq', auth.qqSign);    // qq登录进入
router.get('/user/out', user.out);      // 退出登录
router.get('/user/edit', user.edit);    // 修改用户资料的页面


router.get('/people/:name', user.index);      // 某人的主页
router.get('/people/:name/:page', user.index);// 某人的主页的分页

// 这个页面主要是用于通过iframe框架的地址来传递值！
router.use('/uploadredirect', function (req, res, next) {
	res.send('helloWorld!');
});

module.exports = router;