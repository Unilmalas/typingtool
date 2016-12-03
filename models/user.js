var db = require('../db');

var user = db.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true, select: false } // prevent password from being selected (want to just send the hash)
});

module.exports = db.model('User', user);