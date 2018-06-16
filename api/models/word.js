const mongoose = require('mongoose');

const wordSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	meaning: String
});

module.exports = mongoose.model('Word', wordSchema);