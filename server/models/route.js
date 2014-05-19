/**
 * Module dependencies.
 */
var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema
	$aclPlugin = require('../plugins/accessControlLists');

	
var routeSchema = new Schema({
	path: {
		type: String,
		required: true
	}
});

routeSchema.plugin($aclPlugin);
var Route = $mongoose.model('Route', routeSchema);

module.exports = Route;