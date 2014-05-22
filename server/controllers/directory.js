var modelName = 'Directory';

var $mongoose = require('mongoose'),
	$restful = require('node-restful'),
	$path = require('path'),
	_ = require('lodash');

var model = $mongoose.model(modelName),
	File = $mongoose.model('File'),
	FileCtrl = require('./file.js');

	AccessControlList = $mongoose.model('AccessControlList');

var resource = $restful
	.model(modelName, model.schema)
	.methods(['get', 'post', 'put', 'delete']);

// add file to this directory
resource.route('files.post', {
	detail: true,
	handler: function(req, res, next) {

		var directoryId = req.params.id;

		model.findById(directoryId).exec(function(err, directory) {

			if (!req.body) {
				req.body = {};
			}

			if (err) {
				return res.send(500, err.message);
			}

			if (!directory) {
				return res.send(404, 'Directory not found');
			}

			req.body.directory = directory._id;

			FileCtrl.handleFileUpload(req, res, next); // single place to handle file upload case

		});

	}
});

resource.before('delete', function(req, res, next) {

	var directoryId = req.params.id;
		console.log('controller::file::before::delete::enter');

	model.findById(directoryId).exec(function(err, directory) {
		
		console.log('controller::directory::before::delete::findById::enter');
		if (err) {
			console.log('controller::directory::before::delete::findById::err', err);
			return res.send(500, err.message);

		}

		if (!directory) {
			var err = new Error('Directory not found');
			console.log('controller::directory::before::delete::findById::err', err);
			return res.send(404, err.message);

		}

		directory.remove(function(err) {
			if (err) {
				console.log('controller::directory::before::delete::findById::remove::err');
				return res.send(200, err.message);
			}
			console.log('controller::directory::before::delete::findById::remove::success');
			res.json(200, directory);
		})
	});

});

module.exports = {
	resource: resource
};
