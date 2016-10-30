var db = require('../db');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Type = db.model('Type', {
	_user:	{ type: Schema.ObjectId, ref: 'User' },
	_cust:  { type: Schema.ObjectId, ref: 'Customer' },
	date:	{ type: Date,   required: true, default: Date.now }
});

module.exports = Type;