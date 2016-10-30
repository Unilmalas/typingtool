var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var Cust = db.model('Cust', {
	firstname:	{ type: String,   required: true },
	lastname:	{ type: String,   required: true },
	_acct:		{ type: Schema.ObjectId, 	ref: 'Acct' }
});

module.exports = Cust;