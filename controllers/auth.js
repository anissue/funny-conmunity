var qq = require('../middlewares/qq_auth');
var User = require('../models').User;
var wb = require('../middlewares/wb_auth');

// qq 登录
exports.qqSign = auth.bind(qq);

// 微博 登录
exports.wbSign = auth.bind(wb);

function auth (req, res, next) {
    var This = this;
    var user = {state_login: false};
    var code = req.query.code;
    if (req.cookies.state !== req.query.state) {
        return next();
    }

    var idField = This.authType + 'id';
    This.getAccessToken(code, function (err, access) {
        if (err) return next(err);
        var condition = {};
        condition = This.authType === 'qq' ? condition = {qqid: access.id} : condition = {wbid: access.id};

        User.find(condition, function (err, result) {

            // 新用户
            if (result.length === 0) {
                // 获得授权得来信息
                This.getInfo(access, function (err, info) {
                    if (err) next(err);

                    // 把信息临时保存起来
                    req.session.tempInfo = info;
                    req.session.access = access;
                    return res.redirect('/user/new');
                });
            }

            // 老用户
            if (result.length > 0) {
                // 刷新 token
                var token = User.createToken();
                User.update(condition, {$set: {token: token}}, function (err, result){
                    if (err) return next(err);
                    req.session.token = token;
                    return res.redirect('/');
                });
            }
        });
    });
}