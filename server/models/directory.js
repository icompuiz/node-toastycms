var $mongoose = require('mongoose'),
	$async = require('async'),
	$extend = require('mongoose-schema-extend'),
	FileSystemItem = require('./fileSystemItem');

var DirectorySchema = FileSystemItem.schema.extend({
	files: [{
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'FileSystemItem'
	}]
});

DirectorySchema.pre('remove', function(preRemoveDone) {

	var directory = this;
	var File = $mongoose.model('File');

	File.find({ directory: directory._id }).exec(function(err, files) {
		$async.each(files, function(file, removeNextFile) {

			file.remove(removeNextFile);

		}, preRemoveDone)
	});

});

var Directory = $mongoose.model('Directory', DirectorySchema);
module.exports = Directory;


