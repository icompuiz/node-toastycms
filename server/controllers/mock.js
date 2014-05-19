var modelName = 'Mock';

var $mongoose = require('mongoose'),
	$restful = require('node-restful');

var model = $mongoose.model(modelName),
	Route = $mongoose.model('Route');

var resource = $restful
	.model(modelName, model.schema)
	.methods(['get', 'post', 'put', 'delete']);

resource.before('get', function(req, res, next) {
	var id = req.params.id;

	if (id) {
		model.findOne({_id: id}).exec(function(err, mock) {

			if (mock) {

				mock.isAllowed('read', function(err, isAllowed) {

					if (isAllowed) {
						return next();
					}

					return res.json(401, 'Forbidden');

				});
			} else {

				res.json(404, 'Not found');
			}

		});
	} else {
		// check route acl

		Route.findOne({ path: req.path }).exec(function(err, routeData) {

			if (err) {
				return next(err);
			}

					
			var route = new Route(routeData);
			route.isAllowed('read', function(err, isAllowed) {

				if (err) {
					return next(err);
				}


				if (isAllowed) {
					return next();
				}

				return res.json(401, 'Forbidden');

			});
		});
	}

});

resource.after('get', function(req, res, next) {

	next();

});

module.exports = {
	resource: resource
};