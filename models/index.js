var mongoose = require('mongoose');
var config   = require('../config');

mongoose.Promise = require('bluebird');
mongoose.connect(config.db, function (err) {
	if (err) {
		console.log('connect mongoDB error');
		process.exit(1);
	}
});

var UserSchema = require('./user');
var TopicSchema = require('./topic');
var TopicPassedSchema = require('./topic_passed');
var ReplySchema = require('./reply');

exports.User = mongoose.model('user', UserSchema);
exports.Topic = mongoose.model('topic', TopicSchema);
exports.TopicPassed = mongoose.model('topic_passed', TopicPassedSchema);
exports.Reply       = mongoose.model('reply', ReplySchema);