// API for types
var Type = require('../../models/type');
var User   = require('../../models/user');
var Acct = require('../../models/acct');
var Cust = require('../../models/cust');
var router = require('express').Router();

router.get('/', function (req, res, next) { // get endpoint: note namespace (.use in server.js)
  /*Post.find()
  .sort('-date')
  .populate('_user') // use foreign key
  .populate('username') // use foreign key
  .exec(function (err, types) {
    if (err) { return next(err); }
    res.json(types); // render out the types as JSON
  });*/
});

router.get('/acct_name', function (req, res, next) { // get endpoint to find account by name: note namespace (.use in server.js)
  var srchPattern = req.query.acct;
  Acct.find({ name: { $regex: srchPattern, $options: 'i' } }) // find returns cursor to the result, pattern-match to regex
  .exec(function (err, accts) {
    if (err) { return next(err); }
	if(accts.length) {
		var macct; // temp
		accts.forEach( function (acct) {
			console.log('found name: ' + acct);
			// todo: fix this, what to do if more than one a re found...
			//res.json(acct); // render out the acct as JSON
			var macct = acct; // temp
		});
		res.json(macct); // temp
	}
  });
});

router.get('/acct_mixed', function (req, res, next) { // get endpoint to find account by zip and name: note namespace (.use in server.js)
  var srchName = req.query.name;
  var srchZip = req.query.zip;
  //console.log('mixed srch: ' + srchName + ' zip ' + srchZip);
  Acct.find( { 	$and: [
					{ name: { $regex: srchName, $options: 'i' } },
					{ zip:  { $regex: srchZip, $options: 'i' } } 
			]}) // find returns cursor to the result, pattern-match to regex
  .exec(function (err, accts) {
    if (err) { return next(err); }
	if(accts.length) {
		var macct; // temp
		accts.forEach( function (acct) {
			//console.log('found mixed: ' + acct);
			// todo: fix this, what to do if more than one a re found...
			//res.json(acct); // render out the acct as JSON
			var macct = acct; // temp
		});
		res.json(macct); // temp
	}
  });
});

router.get('/acct_zip', function (req, res, next) { // get endpoint to find account by zip: note namespace (.use in server.js)
  var srchPattern = req.query.acct;
  Acct.find({ zip: { $regex: srchPattern, $options: 'i' } }) // find returns cursor to the result, pattern-match to regex
  .exec(function (err, accts) {
    if (err) { return next(err); }
	if(accts.length) {
		/*var macct; // temp
		accts.forEach( function (acct) {
			console.log('found zip: ' + acct);
			// todo: fix this, what to do if more than one a re found...
			//res.json(acct); // render out the acct as JSON
			var macct = acct; // temp
		});
		res.json(macct); // temp */
		res.json(accts);
	}
  });
});

router.get('/acct_id', function (req, res, next) { // get endpoint to find account by id: note namespace (.use in server.js)
  Acct.findOne({ _id: req.query._id }) // find returns cursor to the result
  .exec(function (err, acct) {
    if (err) { return next(err); }
	res.json(acct);
  });
});

router.get('/cust_name', function (req, res, next) { // get endpoint to find account: note namespace (.use in server.js)
  var srchStr = "" + req.query.lastname;
  var srchPattern = srchStr.split(",");
  srchPattern.forEach( function (item, index, arr) {
	  arr[index] = RegExp(arr[index], "i");
  });
  //console.log('get cust: ' + srchPattern + ' type ' + typeof srchPattern[0]);
  Cust.find( { $or: [
						{ firstname: 	{ $in: srchPattern }},
						{ lastname: 	{ $in: srchPattern }}
					]}) // find returns cursor to the result, pattern-match to regex
  .exec(function (err, custs) {
    if (err) { return next(err); }
	//console.log('get cust find: ' + srchPattern + ' custs ' + custs + custs.length);
	if(custs.length) {
		res.json(custs);
	}
  });
});

router.post('/acct', function (req, res, next) { // post endpoint: note namespace (.use in server.js)
	var acct = new Acct({ 	name:	req.body.name,
							zip:	req.body.zip});
	acct.save(function (err, acct) {
		if (err) { return next(err); }
		//console.log(post.img);
		res.status(201).json(acct);
	});
	/*var type = new Type({	body:     	req.body.body,
							link:		req.body.link,
							img:		req.body.img});
	//post.username = req.auth.username;
	User.findOne({ username: req.auth.username }) // find user
	.exec(function (err, user) {
		if (err) { return next(err); }
		type._user = user._id; // set the post user_id
		type.save(function (err, post) {
			if (err) { return next(err); }
			//console.log(post.img);
			res.status(201).json(type);
		});
	});*/
});

router.post('/cust', function (req, res, next) { // post endpoint: note namespace (.use in server.js)
	var cust = new Cust({ 	firstname:	req.body.firstname,
							lastname:	req.body.lastname});
	cust.save(function (err, cust) {
		if (err) { return next(err); }
		//console.log(post.img);
		res.status(201).json(cust);
	});
});

module.exports = router;