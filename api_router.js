var express = require('express');
var user    = require('./api/user');


var router  = express.Router();


// 增加新用户
router.post('/user/new', user.new);

module.exports = router;