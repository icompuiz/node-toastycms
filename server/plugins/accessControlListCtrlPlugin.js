var _ = require('lodash');

function accessControlListCtrlPlugin(resource, model) {

	// console.log('ksdkslmdsmcscmsdcmslcmsdlcmksdclmsd');

	function removeAclProp(req, res, next) {


		var bundle = res.locals.bundle;

		if (_.isArray(bundle)) {
			
			bundle = _.map(bundle, function(value) {
				value.acl = null;
				return value;
			});

			
		} else {

			bundle.acl = null;

		}

		res.locals.bundle = bundle;
		
		next();

	}

	resource.after('get', removeAclProp);

	resource.after('post', removeAclProp);

	resource.after('put', removeAclProp);

	resource.after('delete', removeAclProp);

}

module.exports = {
	plugin: accessControlListCtrlPlugin
};