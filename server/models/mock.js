var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema,
	$aclPlugin = require('../plugins/accessControlLists');


var mockSchema = new Schema({
	field: String
});

mockSchema.plugin($aclPlugin);
var Mock = $mongoose.model('Mock', mockSchema);

module.exports = Mock;