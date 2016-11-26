var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Acct = db.model('Acct', {
	module:	{ type: String,		required: true }, // module
	name:	{ type: String,   	required: true }, // account name
	zip:	{ type: Number,   	required: true }  // account zip code
});

module.exports = Acct;