var express = require('express');
var user    = require('./api/user');
var post    = require('./api/post');

var router  = express.Router();


// 增加新用户
router.post('/user/new', user.new);

// 站内登录
router.post('/user/login', user.login);

// 上传头像
router.post('/user/avatar', user.uploadAvatar);

// 修改资料
router.post('/user/edit', user.edit);

// 返回登录状态
router.post('/user/islogin', user.isLogin);

// 上传帖子图片
router.post('/post/upload', post.uploadImg);

// 上传帖子
router.post('/post/new', post.uploadTopic);

// 返回一条还没有审核的帖子
router.get('/post/notpass', post.notpass);

// 帖子通过数加一
router.post('/post/pass', post.pass);

// 帖子不通过数加一
router.post('/post/notpass', post.notPass);
module.exports = router;