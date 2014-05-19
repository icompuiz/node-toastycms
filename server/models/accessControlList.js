var $mongoose = require('mongoose'),
	$async = require('async'),
	_ = require('lodash'),
	Schema = $mongoose.Schema;

var AccessControlListSchema = new Schema({
	users: [{
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'UserAccessControlEntry'
	}],
	groups: [{
		type: $mongoose.Schema.Types.ObjectId,
		ref: 'GroupAccessControlEntry'
	}]
});


AccessControlListSchema.pre('save', function(done) {

	var accessControlList = this;

	console.log(accessControlList);

	var User = $mongoose.model('User'),
		Group = $mongoose.model('Group'),
		UserAccessControlEntry = $mongoose.model('UserAccessControlEntry'),
		GroupAccessControlEntry = $mongoose.model('GroupAccessControlEntry');

	var rootUser = User.findOne({ username: 'root' });
	var administratorUser = User.findOne({ username: 'administrator' });
	var administratorsGroup = Group.findOne({name: 'administrators'});

	function addRootUserACE(doneAddingRootUser) {
		rootUser.exec(function(err, root) {
			if (err) {
				return doneAddingRootUser(err);
			}

			if (!_.isArray(accessControlList.users)) {
				accessControlList.users = [];
			}

			var ace = new UserAccessControlEntry();
			ace.user = root._id;
			ace.access = {
				all: true
			};

			ace.save(function(err) {
				if (err) {
					return doneAddingRootUser(err);
				}
				accessControlList.users.push(ace);
				doneAddingRootUser(null, ace);
			});
		});
	}

	function addAdministratorUserACE(doneAddingAdministratorUser) {
		administratorUser.exec(function(err, administrator) {
			if (err) {
				return doneAddingAdministratorUser(err);
			}

			if (!_.isArray(accessControlList.users)) {
				accessControlList.users = [];
			}

			var ace = new UserAccessControlEntry();
			ace.user = administrator._id;
			ace.access = {
				all: true
			};

			ace.save(function(err) {
				if (err) {
					return doneAddingAdministratorUser(err);
				}
				accessControlList.users.push(ace);
				doneAddingAdministratorUser(null, ace);
			});
		});
	}

	function addAdministratorsGroupACE(doneAddingAdministratorsGroup) {
		administratorsGroup.exec(function(err, administrators) {
			if (err) {
				return doneAddingAdministratorsGroup(err);
			}

			if (!_.isArray(accessControlList.users)) {
				accessControlList.users = [];
			}

			var ace = new GroupAccessControlEntry();
			ace.group = administrators._id;
			ace.access = {
				all: true
			};
			ace.save(function(err) {
				if (err) {
					return doneAddingAdministratorsGroup(err);
				}
				accessControlList.groups.push(ace);
				doneAddingAdministratorsGroup(null, ace);
			});
		});
	}

	$async.series({
		root: addRootUserACE,
		administrator: addAdministratorUserACE,
		administrators: addAdministratorsGroupACE
	},function(err, results) {
		if (err) {
			return done(err);
		}
		console.log('Done adding access control entries');
		done();
	});


});

var AccessControlList = $mongoose.model('AccessControlList', AccessControlListSchema);

module.exports = AccessControlList;