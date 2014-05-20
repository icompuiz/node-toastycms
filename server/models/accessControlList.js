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

AccessControlListSchema.statics.create = function(onCreate) {

	var accessControlList = new this({
		users: [],
		groups: []
	});

	function saveAcl(done) {

		accessControlList.save(function(err) {
			if (err) {
				return done(err);
			}
			done();
		});

	}

	onCreate(accessControlList, saveAcl);


};



AccessControlListSchema.statics.addGroups = function(id, groupsToAdd, done) {

	var Group = $mongoose.model('Group'),
		GroupAccessControlEntry = $mongoose.model('GroupAccessControlEntry');

	AccessControlList.findOne({
		_id: id
	}).exec(function(err, acl) {

		if (err) {
			return done(err);
		}

		if (!acl) {
			return done('ACL ' + id + ' not found');
		}

		var groups = [];
		$async.each(groupsToAdd || [], function(groupData, processNextGroup) {

			var name = groupData.name || groupData;

			var groupQuery = Group.findOne({
				name: name
			});

			groupQuery.exec(function(err, group) {
				if (err) {
					return processNextGroup(err);
				}

				if (!group) {
					return processNextGroup('Group ' + name + ' not found');
				}

				console.log("EJEJEJKEEEKWKR EHERE!! jksjkdjkd");

				var ace = new GroupAccessControlEntry({
					group: group._id
				});

				if (groupData.access) {
					ace.access = groupData.access
				}

				ace.save(function(err) {
					if (err) {
						return processNextGroup(err);
					}

					groups.push(ace._id);
					processNextGroup();
				});

			});


		}, function(err) {
			if (err) {
				return done(err);
			}

			AccessControlList.findOneAndUpdate({
				_id: id
			}, {
				$push: {
					groups: {
						$each: groups
					}

				}
			}, {
				upsert: true,
				safe: true
			}, function(err, group) {


				if (err) {
					return done(err);
				}
				done(null, groups);
			});
		});

	});

};

AccessControlListSchema.statics.addUsers = function(id, usersToAdd, done) {

	var User = $mongoose.model('User'),
		UserAccessControlEntry = $mongoose.model('UserAccessControlEntry');

	AccessControlList.findOne({
		_id: id
	}).exec(function(err, acl) {

		if (err) {
			return done(err);
		}

		if (!acl) {
			return done('ACL ' + id + ' not found');
		}

		var users = [];
		$async.each(usersToAdd || [], function(userData, processNextUser) {

			var username = userData.username || userData;

			var userQuery = User.findOne({
				username: username
			});

			userQuery.exec(function(err, user) {
				if (err) {
					return processNextUser(err);
				}

				if (!user) {
					return processNextUser('User ' + username + ' not found');
				}

				var ace = new UserAccessControlEntry({
					user: user._id
				});

				if (userData.access) {
					ace.access = userData.access
				}


				ace.save(function(err) {
					if (err) {
						return processNextUser(err);
					}

					users.push(ace._id);
					processNextUser();
				});

			});


		}, function(err) {
			if (err) {
				return done(err);
			}

			AccessControlList.findOneAndUpdate({
				_id: id
			}, {
				$push: {
					users: {
						$each: users
					}

				}
			}, {
				upsert: true,
				safe: true
			}, function(err) {
				if (err) {
					return done(err);
				}
				done(null, users);
			});
		});

	});


};

AccessControlListSchema.pre('save', function(done) {

	var accessControlList = this;

	console.log(accessControlList);

	var User = $mongoose.model('User'),
		Group = $mongoose.model('Group'),
		UserAccessControlEntry = $mongoose.model('UserAccessControlEntry'),
		GroupAccessControlEntry = $mongoose.model('GroupAccessControlEntry');

	var rootUser = User.findOne({
		username: 'root'
	});
	var administratorUser = User.findOne({
		username: 'administrator'
	});
	var administratorsGroup = Group.findOne({
		name: 'administrators'
	});

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
	}, function(err, results) {
		if (err) {
			return done(err);
		}
		console.log('Done adding access control entries');
		done();
	});


});

AccessControlListSchema.pre('remove', function(done) {

	console.log('model::accessControlList::pre::remove::enter');

	var AccessControlEntry = $mongoose.model('AccessControlEntry');

	var usersAndGroups = _.flatten([this.users, this.groups]);

	$async.each(usersAndGroups, function(ace, deleteNextACE) {
		console.log('model::accessControlList::pre::remove::eachACE::enter');

		AccessControlEntry.findById(ace._id).exec(function(err, ace) {
			console.log('model::accessControlList::pre::remove::eachACE::findById::enter');
			ace.remove(function(err, ace) {
				console.log('model::accessControlList::pre::remove::eachACE::findById::remove::exit');
				deleteNextACE(err);
			});
		});

	}, function(err) {
		done(err);
	});



});

var AccessControlList = $mongoose.model('AccessControlList', AccessControlListSchema);

module.exports = AccessControlList;
