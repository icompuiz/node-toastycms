var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema
	$extend = require('mongoose-schema-extend');

var AccessControlEntry = require('./accessControlEntry.js');

var UserAccessControlEntrySchema = AccessControlEntry.extend({
	user: {
		ref: 'User',
		type: $mongoose.Schema.Types.ObjectId
	}
});

var UserAccessControlEntry = $mongoose.model('UserAccessControlEntry', UserAccessControlEntrySchema);

module.exports = UserAccessControlEntry;

