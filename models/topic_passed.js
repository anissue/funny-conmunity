var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicPassedSchema = new Schema({
	title: {type: String},
	content: {type: String},
	author_id: {type: Schema.ObjectId},
	create_date: {type: Date, default: Date.now},

	like_count: {type: Number, default: 0},
	reply_count: {type: Number, default: 0},
	liker_id: [Schema.Types.ObjectId]
});

TopicPassedSchema.index({author_id: 1});
TopicPassedSchema.index({create_date: -1});

module.exports = TopicPassedSchema;