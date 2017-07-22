var express = require('express');
var user    = require('./api/user');


var router  = express.Router();


// 增加新用户
router.post('/user/new', user.new);

// 站内登录
router.post('/user/login', user.login);

// 上传头像
router.post('/user/avatar', user.uploadAvatar);

// 修改资料
router.post('/user/edit', user.edit);
module.exports = router;