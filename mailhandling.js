// Node.js - Send email on registration: http://stackoverflow.com/questions/8838624/node-js-send-email-on-registration
/*
How to setup the sign-up system: 
- a table for registering users with e-mail, token and token-valid-until (usually several hours) columns
- token is a randomly generated string (e.g. with node's crypto.randomBytes method) that will be sent as a part of the link to the user
- upon entering the link search the database for this token and if it's found, proceed with the registration.
- when creating the token, make sure that it doesn't exist in the db already

Node's base64 export is not url-safe. Therefore, this is the easiest method to obtain the secure token I've found:
require('crypto').randomBytes(48, function(ex, buf) {
    token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-'));
});

better: http://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
require('crypto').randomBytes(48, function(err, buffer) {
  var token = buffer.toString('hex');
});

useful: http://www.bradoncode.com/tutorials/learn-mean-stack-tutorial/

	// https://www.npmjs.com/package/nodemailer-smtp-transport
	// npm install nodemailer
	// npm install nodemailer-smtp-transport
	// Use Smtp Protocol to send Email
	// http://stackoverflow.com/questions/26326027/sending-email-with-node-mailer-and-sendgrid-in-angular-mean-stack-using-angular
	// http://www.bossable.com/1910/angularjs-nodemailer-contact-form/ need to run nodemailer serverside


*/

var express = require('express'),
    connect = require('connect'),
    jade = require('jade'),
    app = module.exports = express.createServer(),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    mailer = require('mailer'), // could use nodemailer
    stylus = require('stylus'),
    markdown = require('markdown').markdown,
    connectTimeout = require('connect-timeout'),
    util = require('util'),
    path = require('path'),
    models = require('./models'),
    db,
    Document,
    User,
    LoginToken,
    Settings = { development: {}, test: {}, production: {} },
    emails;

// start ***************************************
function renderJadeFile(template, options) { // Jade is a template engine to write html
  var fn = jade.compile(template, options);
  return fn(options.locals);
}

emails = {
  send: function(template, mailOptions, templateOptions) {
    mailOptions.to = mailOptions.to;
    renderJadeFile(path.join(__dirname, 'views', 'mailer', template), templateOptions, function(err, text) {
      // Add the rendered Jade template to the mailOptions
      mailOptions.body = text;

      // Merge the app's mail options
      var keys = Object.keys(app.set('mailOptions')),
          k;
      for (var i = 0, len = keys.length; i < len; i++) {
        k = keys[i];
        if (!mailOptions.hasOwnProperty(k))
          mailOptions[k] = app.set('mailOptions')[k]
      }

      console.log('[SENDING MAIL]', util.inspect(mailOptions));

      // Only send mails in production
      if (app.settings.env == 'production') {
        mailer.send(mailOptions,
          function(err, result) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  },

  sendWelcome: function(user) {
    this.send('welcome.jade', { to: user.email, subject: 'Welcome to Nodepad' }, { locals: { user: user } });
  }
};

/* this is called in user.save:
req.flash('info', 'Your account has been created');
    emails.sendWelcome(user);

    switch (req.params.format) {
      case 'json':
        res.send(user.toObject());
      break;

      default:
        req.session.user_id = user.id;
        res.redirect('/documents');
    }
*/

// nodemailer example **************************************
var mailer = require("nodemailer");

    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "gmail_id@gmail.com",
            pass: "gmail_password"
        }
    });

    var mail = {
        from: "Yashwant Chavan <from@gmail.com>",
        to: "to@gmail.com",
        subject: "Send Email Using Node.js",
        text: "Node.js New world for me",
        html: "<b>Node.js New world for me</b>"
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    })

// end *******************************************************

app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/nodepad-development');
  app.use(express.errorHandler({ dumpExceptions: true }));
  app.set('view options', {
    pretty: true
  });
});

app.configure('test', function() {
  app.set('db-uri', 'mongodb://localhost/nodepad-test');
  app.set('view options', {
    pretty: true
  });  
});

app.configure('production', function() {
  app.set('db-uri', 'mongodb://localhost/nodepad-production');
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(connectTimeout({ time: 10000 }));
  app.use(express.session({ store: mongoStore(app.set('db-uri')), secret: 'topsecret' }));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.set('mailOptions', {
    host: 'localhost',
    port: '25',
    from: 'nodepad@example.com'
  });
});

models.defineModels(mongoose, function() {
  app.Document = Document = mongoose.model('Document');
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('db-uri'));
})

function authenticateFromLoginToken(req, res, next) {
  var cookie = JSON.parse(req.cookies.logintoken);

  LoginToken.findOne({ email: cookie.email,
                       series: cookie.series,
                       token: cookie.token }, (function(err, token) {
    if (!token) {
      res.redirect('/sessions/new');
      return;
    }

    User.findOne({ email: token.email }, function(err, user) {
      if (user) {
        req.session.user_id = user.id;
        req.currentUser = user;

        token.token = token.randomToken();
        token.save(function() {
          res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          next();
        });
      } else {
        res.redirect('/sessions/new');
      }
    });
  }));
}

function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else if (req.cookies.logintoken) {
    authenticateFromLoginToken(req, res, next);
  } else {
    res.redirect('/sessions/new');
  }
}

app.get('/', loadUser, function(req, res) {
  res.redirect('/documents')
});

// Error handling
function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(NotFound, Error);

app.get('/404', function(req, res) {
  throw new NotFound;
});

app.get('/500', function(req, res) {
  throw new Error('An expected error');
});

app.get('/bad', function(req, res) {
  unknownMethod();
});

app.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('404.jade', { status: 404 });
  } else {
    next(err);
  }
});

if (app.settings.env == 'production') {
  app.error(function(err, req, res) {
    res.render('500.jade', {
      status: 500,
      locals: {
        error: err
      } 
    });
  });
}

// Document list
app.get('/documents', loadUser, function(req, res) {
  Document.find({ user_id: req.currentUser.id },
                [], { sort: ['title', 'descending'] },
                function(err, documents) {
    documents = documents.map(function(d) {
      return { title: d.title, id: d._id };
    });
    res.render('documents/index.jade', {
      locals: { documents: documents, currentUser: req.currentUser }
    });
  });
});

app.get('/documents.:format?', loadUser, function(req, res) {
  Document.find({ user_id: req.currentUser.id },
                [], { sort: ['title', 'descending'] },
                function(err, documents) {
    switch (req.params.format) {
      case 'json':
        res.send(documents.map(function(d) {
          return d.toObject();
        }));
      break;

      default:
        res.send('Format not available', 400);
    }
  });
});

app.get('/documents/titles.json', loadUser, function(req, res) {
  Document.find({ user_id: req.currentUser.id },
                [], { sort: ['title', 'descending'] },
                function(err, documents) {
    res.send(documents.map(function(d) {
      return { title: d.title, id: d._id };
    }));
  });
});

app.get('/documents/:id.:format?/edit', loadUser, function(req, res, next) {
  Document.findOne({ _id: req.params.id, user_id: req.currentUser.id }, function(err, d) {
    if (!d) return next(new NotFound('Document not found'));
    res.render('documents/edit.jade', {
      locals: { d: d, currentUser: req.currentUser }
    });
  });
});

app.get('/documents/new', loadUser, function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document(), currentUser: req.currentUser }
  });
});

// Create document 
app.post('/documents.:format?', loadUser, function(req, res) {
  var d = new Document(req.body);
  d.user_id = req.currentUser.id;
  d.save(function() {
    switch (req.params.format) {
      case 'json':
        var data = d.toObject();
        // TODO: Backbone requires 'id', but can I alias it?
        data.id = data._id;
        res.send(data);
      break;

      default:
        req.flash('info', 'Document created');
        res.redirect('/documents');
    }
  });
});

// Read document
app.get('/documents/:id.:format?', loadUser, function(req, res, next) {
  Document.findOne({ _id: req.params.id, user_id: req.currentUser.id }, function(err, d) {
    if (!d) return next(new NotFound('Document not found'));

    switch (req.params.format) {
      case 'json':
        res.send(d.toObject());
      break;

      case 'html':
        res.send(markdown.toHTML(d.data));
      break;

      default:
        res.render('documents/show.jade', {
          locals: { d: d, currentUser: req.currentUser }
        });
    }
  });
});

// Update document
app.put('/documents/:id.:format?', loadUser, function(req, res, next) {
  Document.findOne({ _id: req.params.id, user_id: req.currentUser.id }, function(err, d) {
    if (!d) return next(new NotFound('Document not found'));
    d.title = req.body.title;
    d.data = req.body.data;

    d.save(function(err) {
      switch (req.params.format) {
        case 'json':
          res.send(d.toObject());
        break;

        default:
          req.flash('info', 'Document updated');
          res.redirect('/documents');
      }
    });
  });
});

// Delete document
app.del('/documents/:id.:format?', loadUser, function(req, res, next) {
  Document.findOne({ _id: req.params.id, user_id: req.currentUser.id }, function(err, d) {
    if (!d) return next(new NotFound('Document not found'));

    d.remove(function() {
      switch (req.params.format) {
        case 'json':
          res.send('true');
        break;

        default:
          req.flash('info', 'Document deleted');
          res.redirect('/documents');
      } 
    });
  });
});

// Users
app.get('/users/new', function(req, res) {
  res.render('users/new.jade', {
    locals: { user: new User() }
  });
});

app.post('/users.:format?', function(req, res) {
  var user = new User(req.body.user);

  function userSaveFailed() {
    req.flash('error', 'Account creation failed');
    res.render('users/new.jade', {
      locals: { user: user }
    });
  }

  user.save(function(err) {
    if (err) return userSaveFailed();

    req.flash('info', 'Your account has been created');
    emails.sendWelcome(user);

    switch (req.params.format) {
      case 'json':
        res.send(user.toObject());
      break;

      default:
        req.session.user_id = user.id;
        res.redirect('/documents');
    }
  });
});

// Sessions
app.get('/sessions/new', function(req, res) {
  res.render('sessions/new.jade', {
    locals: { user: new User() }
  });
});

app.post('/sessions', function(req, res) {
  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;

      // Remember me
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/documents');
        });
      } else {
        res.redirect('/documents');
      }
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/sessions/new');
    }
  }); 
});

app.del('/sessions', loadUser, function(req, res) {
  if (req.session) {
    LoginToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {});
  }
  res.redirect('/sessions/new');
});

// Search
app.post('/search.:format?', loadUser, function(req, res) {
  Document.find({ user_id: req.currentUser.id, keywords: req.body.s },
                function(err, documents) {
    console.log(documents);
    console.log(err);
    switch (req.params.format) {
      case 'json':
        res.send(documents.map(function(d) {
          return { title: d.title, id: d._id };
        }));
      break;

      default:
        res.send('Format not available', 400);
      break;
    }
  });
});

if (!module.parent) {
  app.listen(3000, 'localhost', function() {
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env)
  });
  
  console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);
}