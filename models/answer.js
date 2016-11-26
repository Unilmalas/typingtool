var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var Answer = db.model('Answer', {
	module:		{ type: String,				required: true }, 	// module
	_type:		{ type: Schema.ObjectId, 	ref: 'Type' },		// typing session the answer was given in
	_quest:		{ type: Schema.ObjectId,   	ref: 'Quest' },		// id of question the answer was given to
	answer:		{ type: String,				required: true },	// chosen answer
	answerpt:	{ type: Number,				required: true }	// point value of chosen answer
});

module.exports = Answer;