var modelName = 'Directory';

var $mongoose = require('mongoose'),
	$restful = require('node-restful');

var model = $mongoose.model(modelName),
	File = $mongoose.model('File'),
	AccessControlList = $mongoose.model('AccessControlList');

var resource = $restful
	.model(modelName, model.schema)
	.methods(['get', 'post', 'put', 'delete']);

resource.route('files.get', {
	detail: true,
	handler: function(req, res, next) {
		var id = req.params.id;


		if (id) {
			var directoryQuery = model.findById(id);
			var fileId = req.query.fileId;
			if (fileId) {
				return directoryQuery.exec(function(err, directory) {
					var file = directory.files.id(fileId);
					if (file) {
						return res.json(200, file);
					}
					res.send(404, 'File not found');
				});
			} else {
				directoryQuery.select('files');
				return directoryQuery.exec(function(err, files) {


					if (err) {
						return res.send(500, err);
					}

					if (!files) {
						return res.send(404, 'Directory not found');

					}

					return res.json(200, files);
				});
			}
		}

		res.send(404, 'Directory not found');
	}
});

resource.route('files.put', {
	detail: true,
	handler: function(req, res, next) {
		res.send(200, 'updating files in directory ' + req.params.id);
	}
});

resource.route('files.post', {
	detail: true,
	handler: function(req, res, next) {

		console.log('controller::filesystem::files.post::enter')
		// res.send(200, 'adding files to directory ' + req.params.id);

		var fileData = {
			name: req.body.name
		};


		console.log('controller::filesystem::files.post::update::before', fileData.name);

		function onAclCreated(accessControlList, saveAcl) {

			function done() {
				return res.json(200, fileData);
			}

			fileData.acl = accessControlList._id;

			model
				.findOneAndUpdate({
						_id: req.params.id
					}, {
						// name: 'NEW NAME'
						$push: {
							files: fileData
						}
					}, {
						upsert: true,
						safe: true
					},
					function(err, directory) {
						console.log('controller::filesystem::files.post::update::after')
						if (err) {
							return res.json(500, err);
						}

						if (!directory) {
							return res.json(404, 'Directory not found');
						}

						saveAcl(done);
					});

		}

		AccessControlList.create(onAclCreated);

	}
});

resource.route('files.delete', {
	detail: true,
	handler: function(req, res, next) {
		var id = req.params.id;

		console.log(Object.keys(req.query));

		if (id) {
			var fileId = req.query.fileId;
			if (fileId) {
				var directoryQuery = model.findByIdAndUpdate({
					_id: id
				}, {
					$pull: {
						files: {
							_id: fileId
						}
					}
				});
				directoryQuery.exec(function(err, directory) {
					if (err) {
						return res.send(500, 'Error deleting the file');
					}
					return res.json(200, directory);
				});
			} else {
				return res.send(500, 'Specify a file');
			}


		}

		res.send(404, 'Directory not found');
	}
});


module.exports = {
	resource: resource
};
