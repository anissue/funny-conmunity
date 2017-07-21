var mongoose = require('mongoose');
var config   = require('../config');

mongoose.connect(config.db, function (err) {
	if (err) {
		console.log('connect mongoDB error');
		process.exit(1);
	}
});

var UserSchema = require('./user');

exports.User = mongoose.model('user', UserSchema);