var $express = require('express'),
	$path = require('path'),
	$passport = require('passport'),
	$config = require('./configuration/config.json'),
	$initialize = require('./configuration/initialize.js'),
	$routes = require('./routes.js'),
	$mongoose = require('mongoose'),
	$fs = require('fs'),
	$argv = require('optimist').argv,
	LocalStrategy = require('passport-local').Strategy,
	$toastySession = require('./toastySession');


var MongoStore = require('connect-mongo')($express);

function main(app, config) {
	app.use($express.logger('dev'));

	app.use($express.cookieParser(config.security.cookieSecret));

	if (config.security.sessionStore) {
		config.security.sessionStore = new MongoStore({
			url: config.security.sessionStore
		});
	}

	app.use($express.session({
		key: config.security.sessionKey,
		secret: config.security.sessionSecret,
		store: config.security.sessionStore
	})); // get this from the configuration

	app.use($express.bodyParser({
		limit: '10mb'
	}));
	app.use($express.query());
	app.use($express.methodOverride());


	app.set('views', $path.join(__dirname,'..','app', 'views'));
	app.set('view engine', 'jade');
	app.set('view options', {
		layout: false
	});



	var modelsPath = $path.join(__dirname, 'models');
	$fs.readdirSync(modelsPath).forEach(function(file) {
		require($path.join(modelsPath, file));
	});

	var User = $mongoose.model('User');

	// setup $passport authentication
	app.use($passport.initialize());
	app.use($passport.session());

	app.use($express.static($path.join(__dirname, '..', '.tmp')));
	app.use($express.static($path.join(__dirname, '..', 'app')));
	app.use(app.router);


	$passport.use(new LocalStrategy(User.authenticate()));
	$passport.serializeUser(User.serializeUser());
	$passport.deserializeUser(User.deserializeUser());
	
	app.all('*',function (req, res, next) {
		console.log("HERE!!!");
		$toastySession.user = req.user;
		next();
	});

	$routes.register(app);

	function connect(err) {
		if (!err) {
			var port = $config.port || 9000;
			app.listen(port, function() {
				console.log('Express server listening on port', port);
			});
		}
	}
	
	if ($argv.initdb) {
		console.log('initialize');
		require('./data/loadData')(app, connect);
	} else {
		connect();
	}
}

var app = $express();
$initialize.run(app, main); // connect to the database and do otherthing, then actually start the server
