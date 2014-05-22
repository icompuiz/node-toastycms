var $mongoose = require('mongoose'),
	$restful = require('node-restful'),
	$path = require('path'),
	_ = require('lodash');

var File = $mongoose.model('File'),
	Directory = $mongoose.model('Directory'),
	AccessControlList = $mongoose.model('AccessControlList');

var resource = $restful
	.model('File', File.schema)
	.methods(['get', 'post', 'put', 'delete']);

var handleFileUpload = function(req, res, next) {
	console.log('controller::file::handleFileUpload::enter')

	var keys = Object.keys(req.files);

	if (keys.length > 0) {


		var directoryId = req.body.directory;

		if (!directoryId) {
			return res.send(500, 'Please specify a directory');
		}

		var firstKey = keys[0];
		var tmpFile = req.files[firstKey];

		var copyData = {
			path: tmpFile.path,
			name: tmpFile.name,
			type: tmpFile.type,
			size: tmpFile.size
		};

		var fileData = {
			name: tmpFile.name
		};

		var file = new File(fileData);


		console.log('controller::file::handleFileUpload::update::before', fileData.name);

		function saveFile() {

			function done(err) {

				if (err) {
					console.log('controller::file::handleFileUpload::findOneAndUpdate::saveFile::done::err')
					return res.send(500, err.message);
				}
				console.log('controller::file::handleFileUpload::findOneAndUpdate::saveFile::done::success')
				return res.json(200, file);
			}

			Directory
				.findOneAndUpdate({
						_id: directoryId
					}, {
						$push: {
							files: file._id
						}
					}, {
						upsert: true,
						safe: true
					},
					function(err, directory) {
						console.log('controller::file::handleFileUpload::findOneAndUpdate::enter');
						if (err) {
							console.log('controller::file::handleFileUpload::findOneAndUpdate::error', err);
							return res.send(500, err.message);
						}

						if (!directory) {
							console.log('controller::file::handleFileUpload::findOneAndUpdate::error', err);
							return res.send(404, 'Directory not found'); // TODO: need to do clean up
						}

						console.log('controller::file::handleFileUpload::findOneAndUpdate::success');
						file.directory = directory._id;

						file.save(done);
					});

		}

		function onFileCopied(err, storedFile) {

			console.log('controller::file::handleFileUpload::onFileCopied::enter');

			if (err) {
				console.log('controller::file::handleFileUpload::onFileCopied::error', err);
				return res.json(500, err);
			}

			console.log('controller::file::handleFileUpload::onFileCopied::success::stored file', storedFile.fileId);
			console.log('controller::file::handleFileUpload::onFileCopied::success::current file', file.fileId);

			saveFile();

		}

		file.copyFile(copyData, onFileCopied);

	}
};

var handleFileDownload = function(req, res, next) {

	console.log('controller::file::handleFileDownload::enter');

	var fileId = req.params.id;

	File.findById(fileId).exec(function(err, file) {

		console.log('controller::file::handleFileDownload::findById::enter');
		if (err) {
			console.log('controller::file::handleFileDownload::findById::error', error);

			return res.send(500, err.message);
		}

		if (!file) {

			var err = new Error('File' +fileId+ 'not found');
			console.log('controller::file::handleFileDownload::findById::error', err);
			return res.send(400, err.message);

		}

		file.download(function(err, fileStream) {

			if (err) {

				console.log('controller::file::handleFileDownload::findById::download::error', err);

				return res.send(500, err.message);

			}
			
			console.log('controller::file::handleFileDownload::findById::download::sucess', 'Sending stream');

			var type = fileStream.contentType;
			res.header('Content-Type', type);
			res.header("Content-Disposition", "attachment; filename=" + $path.basename(fileStream.filename));
			fileStream.stream(true).pipe(res);
		});


	});

};

resource.route('upload.post', {
	detail: true,
	handler: handleFileUpload
});

resource.route('download.get', {
	detail: true,
	handler: handleFileDownload
});

resource.before('delete', function(req, res, next) {

	var fileId = req.params.id;
		console.log('controller::file::before::delete::enter');

	File.findById(fileId).exec(function(err, file) {
		
		console.log('controller::file::before::delete::findById::enter');
		if (err) {
			console.log('controller::file::before::delete::findById::err', err);
			return res.send(500, err.message);

		}

		if (!file) {
			var err = new Error('File not found');
			console.log('controller::file::before::delete::findById::err', err);
			return res.send(404, err.message);

		}

		file.remove(function(err) {
			if (err) {
				console.log('controller::file::before::delete::findById::remove::err');
				return res.send(200, err.message);
			}
			console.log('controller::file::before::delete::findById::remove::success');
			res.json(200, file);
		})
	});

});

module.exports = {
	handleFileUpload: handleFileUpload,
	handleFileDownload: handleFileDownload,
	resource: resource
}
