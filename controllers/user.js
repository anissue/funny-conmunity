

exports.new = function (req, res, next) {

	res.render('./user/new.html', {
		user: req.user,
		info: req.session.temInfo
	});
};