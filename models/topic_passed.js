var mongoose = require('mongoose');
var Schema = mongoose.Schema;

TopicPassedSchema = new Schema({
	title: {type: String},
	content: {type: String},
	author_id: {type: Schema.ObjectId},
	create_date: {type: Date, default: Date.now()},

	like_count: {type: Number, default: 0},
	reply_count: {type: Number, default: 0}
});

TopicPassedSchema.index({author_id: -1});
TopicPassedSchema.index({create_date: -1});

module.exports = TopicPassedSchema;