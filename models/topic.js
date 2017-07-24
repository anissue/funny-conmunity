var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var TopicSchema = new Schema({
	title: {type: String},
	content: {type: String},
	author_id: {type: Schema.ObjectId},

	passed_count: {type: Number, default: 0}, // 同意通过的数量
	good: {type: Boolean, default: false}, // 精华帖
	reply_count: {type: Number, default: 0},
	like_count: {type: Number, default: 0},
	create_date: {type: Date, default: Date.now()}
});

// 验证帖子合法性
TopicSchema.statics.legal = function (topic) {
	if (!topic.title || !topic.content)
		return {states: -1, hint: '请填写完整!'};

	if (topic.title.length < 5)
		return {states: -2, hint: '5个字都挤不出来吗!'};

	if (topic.title.length > 100)
		return {states: -3, hint: '标题超长咯!'};

	if (!topic.content)
		return {states: -4, hint: '没有选择图片!'};

	return {states: 1, hint: '合法'};
};

TopicSchema.index({author_id: -1});
TopicSchema.index({create_id: -1});

module.exports = TopicSchema;