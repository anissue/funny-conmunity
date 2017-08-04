var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ReplySchema = new Schema({
	content: {type: String},
	reply_id: {type: ObjectId},
	topic_id: {type: ObjectId},
	create_date: {type: Date, default: Date.now},
	like_count: {type: Number, default: 0},
	liker_id: [Schema.Types.ObjectId]
});

ReplySchema.statics.legal = function (replyData) {
	if (replyData.content === undefined || replyData.content.length < 1 || replyData.content.length > 150) {
		return {states: -2, hint: '评论数据有误'};
	}
	if (replyData.reply_id === undefined) {
		return {states: -2, hint: '评论人id为空'};
	}
	if (replyData.topic_id === undefined) {
		return {states: -2, hint: '帖子id为空'};
	}
	return {states: 1, hint: '数据合法'};
};

ReplySchema.index({topic_id: 1});
ReplySchema.index({reply_id: 1});
ReplySchema.index({create_date: -1});

module.exports = ReplySchema;