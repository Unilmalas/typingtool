var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Quest = db.model('Quest', {
	module:		{ type: String,				required: true }, 	// module
	type:		{ type: String,				required: true }, 	// question type (t=typing, q=quizz)
	question:	{ type: String,   			required: true },	// the question
	answers:	{ type: [String],			required: true },	// all potential answers
	points:		{ type: [Number],			required: true }	// point value for answers
});

module.exports = Quest;