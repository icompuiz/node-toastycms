var $mongoose = require('mongoose'),
	extend = require('mongoose-schema-extend'),
	Model = require('./_model');

var FileSystemItemSchema = Model.schema.extend({
	name: {
		type: String,
		default: '',
		trim: true,
	},
	directory: {
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'Directory'
	}
}, {
	collection: 'filesystemitems'
});

var FileSystemItem = $mongoose.model('FileSystemItem', FileSystemItemSchema);
module.exports = FileSystemItem;