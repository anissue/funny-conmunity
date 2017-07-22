var https  = require('https');
var qs     = require('querystring');
var config = require('../config');

/*
  新浪微博的授权方式真奇葩
  获得 token 的方法是 post
  请求体需要附带在 url 上的方式提交，也就是相当于get了。。
  如果把请求体通过 req.write(data) 提交的话，死活获取不到想要的返回
 */

function getAccessToken(code, callback) {

	var data = qs.stringify({
		client_id: config.wb.ID,
		client_secret: config.wb.SECRET,
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: config.wb.CALLBACK_URI
	});

	var options = {
		hostname: 'api.weibo.com',
		port: 443,
		path: '/oauth2/access_token?' + data,
		method: 'POST'
	};

	var req = https.request(options, function (res) {

		res.setEncoding('utf8');
		res.on('data', function (result) {
			result = JSON.parse(result);
			if (result.error_code) return callback(new Error('get weibo access_token error'));

			var access = {
				id: result.uid,
				token: result.access_token
			};
			return callback(null, access);
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
 * info = {
 *   name: *,
 *   desc: *,
 *   avatar: *,
 *   type: 'wb'
 * }
 * qq的接口不返回个人描述的。。。
 * */
function getInfo (access, callback) {

	var options = {
		hostname: 'api.weibo.com',
		port: 443,
		path: '/2/users/show.json?uid=' + access.id + '&access_token=' + access.token,
		method: 'GET'
	};

	var req = https.request(options, function (res) {

		res.setEncoding('utf8');
		res.on('data', function (result) {
			result = JSON.parse(result);
			if (result.error_code) return callback(new Error('get weibo info error'));

			var info = {
				name: result.name,
				desc: result.description,
				avatar: result.avatar_large,
				type: 'wb'
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

exports.authType = 'wb';
exports.getAccessToken = getAccessToken;
exports.getInfo  = getInfo;
