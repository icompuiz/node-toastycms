var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema,
	$accessControlListPlugin = require('../plugins/accessControlLists.js');
	
var mockSchema = new Schema({
	field: String
});

var Mock = $mongoose.model('Mock', mockSchema);

mockSchema.plugin($accessControlListPlugin);

module.exports = Mock;