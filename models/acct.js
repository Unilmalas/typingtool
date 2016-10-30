var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Acct = db.model('Acct', {
	name:	{ type: String,   required: true },
	zip:	{ type: String,   required: true }
});

module.exports = Acct;