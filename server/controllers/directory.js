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

var handlePermissionCheck = function handlePermissionCheck(right, req, res, onAllowed) {

	var directoryId = req.params.id;
	console.log('controller::directory::handlePermissionCheck::', right, '::enter');

	model.findById(directoryId).exec(function(err, directory) {

		console.log('controller::directory::handlePermissionCheck::', right, '::findById::enter');
		if (err) {
			console.log('controller::directory::handlePermissionCheck::', right, '::findById::err', err);
			return res.send(500, err.message);

		}

		if (!directory) {
			var err = new Error('Directory not found');
			console.log('controller::directory::handlePermissionCheck::', right, '::findById::err', err);
			return res.send(404, err.message);
		}

		directory.isAllowed(right, function(err, isAllowed) {

			if (err) {
				console.log('controller::directory::handlePermissionCheck::', right, '::isAllowed::err', err);
				return res.send(500, err.message);
			}

			if (!isAllowed) {
				return res.json(401, 'Forbidden');
			}

			onAllowed(directory);

		});
	});

}

// add file to this directory
// Access Control: update 
resource.route('files.post', {
	detail: true,
	handler: function(req, res, next) {

		var onAllowed = function onAllowed(directory) {
			req.body.directory = directory._id;

			FileCtrl.handleFileUpload(req, res, next); // single place to handle file upload case
		};

		handleFileUpload('update', req, res, onAllowed);

	}
});

// Access Control: remove 
resource.before('delete', function(req, res, next) {

	
	console.log('controller::directory::before::delete::enter');

	var onAllowed = function onAllowed(directory) {
		directory.remove(function(err) {
			if (err) {
				console.log('controller::directory::before::delete::findById::remove::err');
				return res.send(200, err.message);
			}
			console.log('controller::directory::before::delete::findById::remove::success');
			res.json(200, directory);
		});
	};

	handlePermissionCheck('remove', req, res, onAllowed);

});

// Access Control: update 
resource.before('put', function(req, res, next) {

	var onAllowed = function() {
		next();
	};

	handlePermissionCheck('update', req, res, onAllowed);

});

// Access Control: read
resource.before('get', function(req, res, next) {

	var onAllowed = function() {
		next();
	};


	handlePermissionCheck('read', req, res, onAllowed);

});

module.exports = {
	resource: resource
};
