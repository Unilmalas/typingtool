var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Type = db.model('Type', {
	module:	{ type: String,				required: true }, 	// module
	_user:	{ type: Schema.ObjectId, 	ref: 'User' },		// link to user
	_cust:  { type: Schema.ObjectId, 	ref: 'Customer' },	// link to customer
	date:	{ type: Date,   			required: true, default: Date.now } // typing date
});

module.exports = Type;