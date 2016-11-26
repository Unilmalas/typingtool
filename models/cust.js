var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var Cust = db.model('Cust', {
	module:		{ type: String,				required: true }, // module
	firstname:	{ type: String,   			required: true }, // customer first name
	lastname:	{ type: String,   			required: true }, // customer last name
	_acct:		{ type: Schema.ObjectId, 	ref: 'Acct' }	  // link to account
});

module.exports = Cust;