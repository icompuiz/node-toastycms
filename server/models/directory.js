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
	files: [File]
});

DirectorySchema.plugin($accessControlListPlugin);

var Directory = $mongoose.model('Directory', DirectorySchema);


