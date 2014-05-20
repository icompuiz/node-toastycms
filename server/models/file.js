var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema,
	_ = require("lodash"),
	$async = require('async'),
	$accessControlListPlugin = require('../plugins/accessControlLists.js');

var FileSchema = new Schema({
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
	gridfs: {
		type: $mongoose.Schema.Types.ObjectId
	}
});

FileSchema.plugin($accessControlListPlugin);

var File = $mongoose.model('File', FileSchema);

module.exports = FileSchema;


