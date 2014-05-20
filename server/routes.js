'use strict';

var _ = require('lodash'),
	$async = require('async'),
	$toastySession = require('./toastySession');

var routesRegistered = false;


function main(app) {

	if (routesRegistered) {
		console.log('Routes have already been registered');
		return;
	}

	routesRegistered = true;

	var Authentication = require('./controllers/authenticationCtrl.js');
	var Mock = require('./controllers/mock.js');
	var Route = require('./controllers/route.js');
	var Filesystem = require('./controllers/filesystem.js');

	var apiRoutes = [{
		path: '/api/mock',
		controller: Mock,
		access: {
			users: [{
				username: 'public',
				access: {
					read: true,
					create: true
				}
			}],
			groups: [{
				name: 'users',
				access: {
					read: true,
					create: true
				}
			}]
		}
	}, {
		path: '/api/fs',
		controller: Filesystem,
		access: {
			users: [{
				username: 'public',
				access: {
					read: true,
					create: true
				}
			}],
			groups: [{
				name: 'users',
				access: {
					read: true,
					create: true
				}
			}]
		}

	}];

	var authRoutes = [{
		path: '/register',
		httpMethod: 'POST',
		middleware: [Authentication.register]
	}, {
		path: '/login',
		httpMethod: 'POST',
		middleware: [Authentication.login]
	}, {
		path: '/logout',
		httpMethod: 'GET',
		middleware: [Authentication.logout]
	}]

	var staticRoutes = [{
		path: 'partials/*',
		httpMethod: 'GET',
		middleware: function(req, res) {
			var requestedView = path.join('./', req.url);
			res.render(requestedView, function(err, html) {
				if (err) {
					res.render('404');
				} else {
					res.send(html);
				}
			});
		}
	}, {
		path: '/',
		httpMethod: 'GET',
		middleware: function(req, res) {
			res.render('index', {
				user: req.user
			});
		}
	}];

	// function setUser(req, res, next) {

	// 	$toastySession.req = req;
	// 	if (req.user) {
	// 		$toastySession.user = req.user;
	// 		console.log('Current User::', $toastySession.user._id);
	// 	}

	// 	next();

	// }

	function cleanRequest(req, res, next) {
		if (req.user) {
			if (req.user.salt) {
				req.user.salt = null;
			}
			if (req.user.hash) {
				req.user.hash = null;
			}
		}
		next();
	}

	function registerRoute(route) {

		console.log('Registering', route.path)

		if (!_.isArray(route.middleware)) {

			route.middleware = [route.middleware];

		}

		// route.middleware.unshift(setUser);
		route.middleware.unshift(cleanRequest);


		var args = _.flatten([route.path, route.middleware]);

		switch (route.httpMethod) {
			case 'GET':
				app.get.apply(app, args);
				break;
			case 'POST':
				app.post.apply(app, args);
				break;
			case 'PUT':
				app.put.apply(app, args);
				break;
			case 'DELETE':
				app.delete.apply(app, args);
				break;
			default:
				throw new Error('Invalid method specified for route ' + route.path);
				break;
		}

	}


	_.each(authRoutes, registerRoute);
	_.each(staticRoutes, registerRoute);

	_.each(apiRoutes, function(route) {

		console.log('Registering route', route.path);

		route.controller.resource
			.before('get', Route.checkRoute)
			.before('post', Route.checkRoute)

		.after('get', cleanRequest)
			.after('post', cleanRequest)
			.after('put', cleanRequest)
			.after('delete', cleanRequest);

		route.controller.resource.register(app, route.path);
	});

	module.exports.apiRoutes = apiRoutes;
}


module.exports = {
	register: main
};
