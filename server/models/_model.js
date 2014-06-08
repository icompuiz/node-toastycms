var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema,
	$accessControlListPlugin = require('../plugins/accessControlLists.js');

var ModelSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	}
});

ModelSchema.plugin($accessControlListPlugin);
var Model = $mongoose.model('Model', ModelSchema);
module.exports = Model;
