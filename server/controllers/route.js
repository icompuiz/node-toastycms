var $mongoose = require('mongoose'),
	Route = $mongoose.model('Route');

module.exports.checkRoute = function(req, res, next) {
	console.log('controler::route::checkRoute::enter');

	if (req.params.id) {
		
		console.log('controler::route::checkRoute', 'forwarding to object permission checks');

		return next();
	}

	
	var right;
	if ('get' === req.method.toLowerCase()) {
		right = 'read';
	} else if ('post' === req.method.toLowerCase()) {
		right = 'create';
	}

	if (!right) {
		return next();
	}
	
	console.log('controler::route::checkRoute::right', right);

	Route.findOne({
		path: req.path
	}).exec(function(err, routeData) {

		if (err || !routeData) {

			if (!routeData) {
				err = 'Permissions for route not defined';
			}

			return res.json(500, err);
		}

		var route = new Route(routeData);
		route.isAllowed(right, function(err, isAllowed) {
			if (err) {
				return res.json(500, err);
			}

			if (isAllowed) {
				return next();
			}

			res.send(401, 'Forbidden');


		});
	});

};
