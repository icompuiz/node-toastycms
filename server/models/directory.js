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

	FileSystemItem.find({ directory: directory._id }).exec(function(err, files) {
		$async.each(files, function(file, removeNextItem) {

			file.remove(removeNextItem);

		}, preRemoveDone)
	});
});

var Directory = $mongoose.model('Directory', DirectorySchema);
module.exports = Directory;


