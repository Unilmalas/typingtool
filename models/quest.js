var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var Quest = db.model('Quest', {
	question:	{ type: String,   			required: true },	// the question
	answers:	{ type: [String],			required: true }	// all potential answers
});

module.exports = Quest;