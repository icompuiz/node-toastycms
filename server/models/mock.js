var $mongoose = require('mongoose'),
	Model = require('./_model');
	


var mockSchema = Model.schema.extend({
	field: String
});

var Mock = $mongoose.model('Mock', mockSchema);

module.exports = Mock;