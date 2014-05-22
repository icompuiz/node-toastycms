var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema,
	_ = require("lodash"),
	$async = require('async'),
	$accessControlListPlugin = require('../plugins/accessControlLists.js');

var File = require('./file.js');

var DirectorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
	},
	parent: {
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'Directory'
	},
	files: [{
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'File'
	}]
});

DirectorySchema.pre('remove', function(done) {

	var directory = this;

	File.find({ directory: directory._id }).exec(function(err, files) {
		$async.each(files, function(file, removeNextFile) {

			file.remove(removeNextFile);

		}, done)
	});

});

DirectorySchema.plugin($accessControlListPlugin);

var Directory = $mongoose.model('Directory', DirectorySchema);


