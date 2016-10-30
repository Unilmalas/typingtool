// API for users
// this controller has two actions: get an existing user and create a new one
var router = require('express').Router();
var bcrypt = require('bcrypt-nodejs');
var jwt    = require('jwt-simple');
var User   = require('../../models/user');
var config = require('../../config');

router.get('/', function (req, res, next) { // get an existing user; /users instead of / - note namespacing in server.js
  if (!req.headers['x-auth']) {
    return res.sendStatus(401); // 401: unauthorized
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret); // pass a JWT-token and decode
  User.findOne({username: auth.username}, function (err, user) { // get user from db
    if (err) { return next(err); }
    res.json(user);
  });
});

router.post('/', function (req, res, next) { // create a new user
  var user = new User({username: req.body.username});
  var salt = bcrypt.genSalt(10, function (err, reply) { // generate salt with 10 rounds (bcrypt-nodejs)
	  if (err) { return next(err); }
	  return reply;
  });
  //bcrypt.hash(req.body.password, 10, function (err, hash) { // hash user password
  bcrypt.hash(req.body.password, salt, null, function (err, hash) { // hash user password (bcrypt-nodejs)
    if (err) { return next(err); }
    user.password = hash;
    user.save(function (err) { // save user to db (just hashed password)
      if (err) { return next(err); }
      res.sendStatus(201);  // 201: created
    });
  });
});

module.exports = router;