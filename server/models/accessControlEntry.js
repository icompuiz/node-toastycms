var $mongoose = require('mongoose'),
	Schema = $mongoose.Schema;


var AccessControlEntrySchema = new Schema({
	access: {
		all: {
			type: Boolean,
			default: false
		},
		create: {
			type: Boolean,
			default: false
		},
		read: {
			type: Boolean,
			default: false
		},
		update: {
			type: Boolean,
			default: false
		},
		remove: {
			type: Boolean,
			default: false
		}
	}
},{
	collection: 'accesscontrolentries'
});

var AccessControlEntry = $mongoose.model('AccessControlEntry', AccessControlEntrySchema); // registered but not directly accessible
module.exports = AccessControlEntry;
