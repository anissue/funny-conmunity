var User = require('../models').User;

exports.new = function (req, res, next) {

	// 查看数据是否合法
	var data = req.body;
	var legal = User.legal(data);

	if (legal.states !== 1) return res.json(legal);

	data.type = req.session.temInfo === null ? 'dnd' : req.session.temInfo.type ;
	data.token = User.createToken();
	data.password = User.cryptoPassword(data.password);

	if (data.type === 'qq') {
		data.qqid = req.session.access.id;
	} else if (data.type === 'wb') {
		data.wbid = req.session.access.id;
	}

	req.session.temInfo = null;
	req.session.access  = null;
	req.session.token   = data.token;
	User.create(data, function (err) {
		if (err) return res.json({ states: -3, hint: '用户名已存在', err: err });
		return res.json({ states: 1, 'hint': '成功' });
	});

};