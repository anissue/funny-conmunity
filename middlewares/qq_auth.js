var config = require('../config.js');
var https  = require('https');
var qs     = require('querystring');


function getAccessToken (code, callback) {

    var data = qs.stringify({
        code          : code,
        client_id     : config.qq.ID,
        grant_type    : 'authorization_code',
        redirect_uri  : config.qq.CALLBACK_URI,
        client_secret : config.qq.SECRET
    });

    var options = {
        hostname: 'graph.qq.com',
        port: 443,
        path: '/oauth2.0/token?' + data,
        method: 'GET'
    };

    var req = https.request(options, function (res) {

        res.setEncoding('utf8');
        res.on('data', function (result) {
            if (result.indexOf('error') !== -1)
                return callback(new Error('get access_token error'), null);

			result = result.substring(result.indexOf('access_token=') + 13, result.indexOf('&'));
            // 继续获得 openID

            return getOpenId(result, callback);

        });
    });

    req.on('error', function (err) {
        return callback(err, null);
    });

    req.write('');
    req.end();
}

/*
 * 返回的信息
 * access = {
 *   id: *,
 *   token: *
 * }
 * qq的接口不返回个人描述的。。。
 * */
function getOpenId (access, callback) {
    var options = {
        hostname: 'graph.qq.com',
        port: 443,
        path: '/oauth2.0/me?access_token=' + access,
        method: 'GET'
    };

    var req = https.request(options, function (res) {
        
        res.setEncoding('utf8');
        res.on('data', function (result) {
            result = result.substring(result.indexOf('openid":"') + 9, result.lastIndexOf('"'));
			if (result.indexOf('error') !== -1) return callback(new Error('get openID error'), null);

            // 获得用户QQ信息需要这两个参数，微博只需要一个
            access = {
                id: result,
                token: access
            };
            return callback(null, access);
        });
    });

    req.on('error', function (err) {
        return err;
    });

    req.write('');
    req.end();
}


/*
* 返回的信息
* info = {
*   name: *,
*   desc: *,
*   avatar: *,
*   type: 'qq'
* }
* qq的接口不返回个人描述的。。。
* */
function getInfo (access, callback) {
    var data = qs.stringify({
		access_token: access.token,
		oauth_consumer_key: config.qq.ID,
		openid: access.id
    });

    var options = {
        hostname: 'graph.qq.com',
        port: 443,
        path: '/user/get_user_info?' + data,
        method: 'GET'
    };
    console.log(options.path);
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (result) {
            result = JSON.parse(result);
            if (result.et < 0) return callback(new Error('get qq info error'));

            var info = {
                name: result.nickname,
                desc: '',
                avatar: result.figureurl_qq_2 || result.figureurl_2,
                type: 'qq'
            };
            return callback(null, info);
		});
	});

    req.on('error', function (err) {
       return callback(err, null);
	});
    req.write('');
    req.end();
}

exports.authType = 'qq';
exports.getAccessToken = getAccessToken;
exports.getInfo = getInfo;
/*
 https://graph.qq.com/user/get_user_info?access_token=YOUR_ACCESS_TOKEN&oauth_consumer_key=YOUR_APP_ID&openid=YOUR_OPENID

 */