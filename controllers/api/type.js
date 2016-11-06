// API for types
var Type = require('../../models/type');	// typing event (collects user ans answers for a given date)
var User   = require('../../models/user');	// user
var Acct = require('../../models/acct');	// account
var Cust = require('../../models/cust');	// customer in account
var Quest = require('../../models/quest');	// question and possible answers with points
var Answer = require('../../models/answer');// answers to questions
var router = require('express').Router();

router.get('/', function (req, res, next) { // get endpoint: note namespace (.use in server.js)
  Quest.find()
  .exec( function (err, quests) {
    if (err) { return next(err); }
    res.json(quests); // render out the quests as JSON
  });
});

router.get('/acct_name', function (req, res, next) { // get endpoint to find account by name: note namespace (.use in server.js)
  var srchPattern = req.query.acct==null ? ".*" : ("/.*" + req.query.acct + "/");
  Acct.find({ name: { $regex: srchPattern, $options: 'i' } }) // find returns cursor to the result, pattern-match to regex
  .exec( function (err, accts) {
    if (err) { return next(err); }
	if(accts.length) {
		res.json(accts);
	}
  });
});

router.get('/acct_mixed', function (req, res, next) { // get endpoint to find account by zip and name: note namespace (.use in server.js)
  var srchName = req.query.name;
  if(req.query.zip.match(/^\d+$/)) {
	var srchZip = parseInt(req.query.zip);
  } else {
	var srchZip = 0;
  }
  //console.log('mixed srch: ' + srchName + ' zip ' + srchZip);
  Acct.find( { 	$or: [
					{ name: { $regex: srchName, $options: 'i' } },
					{ zip:  srchZip } 
			]}) // find returns cursor to the result, pattern-match to regex
  .exec( function (err, accts) {
    if (err) { return next(err); }
	if(accts.length) {
		res.json(accts);
	}
  });
});

router.get('/acct_zip', function (req, res, next) { // get endpoint to find account by zip: note namespace (.use in server.js)
  if(req.query.acct == "") {
	  Acct.find({ zip: { $gt: 0, $lt: 9999 }}) // find returns cursor to the result
	  .exec( function (err, accts) {
		if (err) { return next(err); }
		//console.log('acct zip find: ' + accts + ' err ' + err);
		if(accts.length) {
			res.json(accts);
		}
	  });
  } else {
	  if(req.query.acct.match(/^\d+$/)) {
		var srchZip = parseInt(req.query.acct);
	  } else {
		var srchZip = 0;
	  }
	  Acct.find({ zip: srchZip}) // find returns cursor to the result
	  .exec( function (err, accts) {
		if (err) { return next(err); }
		//console.log('acct zip find: ' + accts + ' err ' + err);
		if(accts.length) {
			res.json(accts);
		}
	  });	  
  }
});

router.get('/acct_id', function (req, res, next) { // get endpoint to find account by id: note namespace (.use in server.js)
  Acct.findOne({ _id: req.query._id }) // find returns cursor to the result
  .exec( function (err, acct) {
    if (err) { return next(err); }
	res.json(acct);
  });
});

router.get('/cust_name', function (req, res, next) { // get endpoint to find customer: note namespace (.use in server.js)
  var srchStr = "" + req.query.lastname;
  var srchPattern = "";
  if(srchStr=="") srchPattern=".*";
  else srchPattern = srchStr + ".*";
  //console.log('get cust: ' + srchPattern + ' type ' + typeof srchPattern[0]);
  Cust.find( { $or: [
						{ firstname: 	{ $regex: srchPattern, $options: 'i' }}, // for $in only js-style /patterns/ work!
						{ lastname: 	{ $regex: srchPattern, $options: 'i' }}
					]}) // find returns cursor to the result, pattern-match to regex
  .exec( function (err, custs) {
    if (err) { return next(err); }
	//console.log('get cust find: ' + srchPattern + ' custs ' + custs + custs.length);
	if(custs.length) {
		res.json(custs);
	}
  });
});

router.get('/cust_acct', function (req, res, next) { // get endpoint to find customer in acct: note namespace (.use in server.js)
  var srchStr = "" + req.query.lastname; // fetch lastname from parameters
  var acctid = req.query._acct; // acct id from parameters
  var srchPattern = "";
  if(srchStr=="") srchPattern=".*";
  else srchPattern = ".*" + srchStr + ".*";
  //console.log('get cust: ' + srchPattern + ' type ' + typeof srchPattern[0] + ' acctid: ' + acctid);
  Cust.find( {
			$and: [
				{ $or: [
						{ firstname: 	{ $regex: srchPattern, $options: 'i' }}, // for $in only js-style /patterns/ work!
						{ lastname: 	{ $regex: srchPattern, $options: 'i' }}
					]},
				{ _acct: acctid }]}) // fmatch to account id of the current account chosen (show only those customers in that account)
  .exec( function (err, custs) {
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
	acct.save( function (err, acct) {
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

router.post('/cust', function (req, res, next) { // customer post endpoint: note namespace (.use in server.js)
	var cust = new Cust({ 	firstname:	req.body.firstname,
							lastname:	req.body.lastname});
	cust.save( function (err, cust) {
		if (err) { return next(err); }
		res.status(201).json(cust);
	});
});

router.post('/quest', function (req, res, next) { // question post endpoint: note namespace (.use in server.js)
	var quest = new Quest({ 	question:	req.body.question,
								answers:	req.body.answers,
								points:		req.body.points});
	quest.save( function (err, quest) {
		if (err) { return next(err); }
		res.status(201).json(quest);
	});
});

router.post('/answers', function (req, res, next) { // answer post endpoint: note namespace (.use in server.js)
	Cust.findOne({ firstname:	req.body.firstname,
					lastname:	req.body.lastname})
	.exec( function (err, cust) {	// find customer by name to get index
		if (err) { return next(err); }
		// todo: check if cust is filled!
		var type = new Type({	_cust:		cust._id}); // create type document with customer index, date autofilled
		type.save( function (err, type) {
			if (err) { return next(err); }
			var i=0;
			for (quest in req.body.quests) {	// loop through all questions
				//console.log('API answer post: ' + req.body.tanswers[i] + ' quest: ' + req.body.quests[0].question);
				var answer = new Answer({	_type:		type._id,	// link answer to current typing event
											_quest:		req.body.quests[i]._id,	// add link to question of the answer
											answer:		req.body.quests[i].answers[req.body.tanswers[i]],	// store answer chosen (choice is stored in tanswers)
											answerpt:	req.body.quests[i].points[req.body.tanswers[i]]});	// add point value of the answer
				i++; // index counting questions, used to retrieve the answer chosen for i-th question
				answer.save( function (err, answer) {
					if (err) { return next(err); }
					// res ? - inside loop results in multiple res sends, this causes a "can't send headers" error
				});
			}
			res.status(201).json(type);
		});
	});
});

module.exports = router;