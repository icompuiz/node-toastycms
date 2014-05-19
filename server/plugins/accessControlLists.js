/**
 * Module dependencies.
 */
var $mongoose = require('mongoose'),
	$async = require('async'),
	_ = require('lodash'),
	$toastySession = require('../toastySession');


function AccessControlListPlugin(schema, options) {

	schema.add({ // Attach acls to existing schema
		acl: {
			ref: 'AccessControlList',
			type: $mongoose.Schema.Types.ObjectId
		}
	});

	schema.methods.isAllowed = function(right, done) {
		right = right || 'read';

		var data = this;

		var currentUser = $toastySession.user || null;

		var User = $mongoose.model('User'),
			Group = $mongoose.model('Group'),
			AccessControlList = $mongoose.model('AccessControlList'),
			UserAccessControlEntry = $mongoose.model('UserAccessControlEntry');

		console.log("Checking acls for", currentUser.username, "on resource", data._id);

		if (currentUser) {

			AccessControlList
				.findOne(data.acl)
				.populate('users groups')
				.exec(function(err, acl) {

					console.log("AccessControlListPlugin::isAllowed::findById::enter", acl._id);

					if (err) {
						return done(err);
					}

					if (!acl) {
						var err = new Error('ACL for model missing');
						return done(err);
					}

					var userFound = false;
					var groupFound = false;

					function checkUser(userAllowedResult) {

						console.log("AccessControlListPlugin::isAllowed::checkUser::enter");

						// var users = _.map(acl.users, function());

						var allowed = false;

						$async.each(acl.users, function(userACE, processNextUser) {

							User
								.findOne({
									_id: userACE.user
								})
								.exec(function(err, user) {

									if (err) {
										return processNextUser(err);
									}

									if (user) {


										if (user._id.equals(currentUser._id)) {
											userFound = true;
											allowed = userACE.access[right] || userACE.access.all;
											if (undefined === allowed) {
												allowed = false;
											}
											if (!allowed) {
												return processNextUser('notallowed')
											}


										}
									}

									processNextUser();

								});
						}, function(result) {
							if ('notallowed' === result) {
								return userAllowedResult(null, false);
							}

							if (result) {
								userAllowedResult(result);
							}
							console.log("AccessControlListPlugin::isAllowed::checkUser::isAllowed", allowed);

							userAllowedResult(null, allowed);

						});

					}

					function checkGroups(userInGroupResult) {

						console.log("AccessControlListPlugin::isAllowed::checkGroups::enter");


						var allowed = false;

						$async.each(acl.groups, function(groupACE, processNextGroup) {

							Group
								.findOne({
									_id: groupACE.group
								})
								.populate('members')
								.exec(function(err, group) {

									if (err) {
										return processNextGroup(err);
									}

									// console.log(group.members);

									var user = _.find(group.members, function(member) {
										return member._id.equals(currentUser._id);
									});

									console.log(group.name);

									if (user) {

										groupFound = true;

										allowed = groupACE.access[right] || groupACE.access.all;
										if (undefined === allowed) {
											allowed = false;
										}

										if (!allowed) {
											return processNextGroup('notallowed')
										}
									}

									processNextGroup();

								});

						}, function(result) {
							if ('notallowed' === result) {
								return userInGroupResult(null, false);
							}

							if (err) {
								return userInGroupResult(err);
							}

							console.log("AccessControlListPlugin::isAllowed::checkGroups::isAllowed", allowed);

							userInGroupResult(null, allowed);
						});

					}

					$async.series({
						user: checkUser,
						group: checkGroups
					}, function(err, result) {

						if (err) {
							return done(err);
						}

						var isAllowed = result.user && result.group;

						// if the user is defined in a group but
						// the user rights evaluates to a false case (ie defined and false or not defined)
						// check if the user is defined and false
						// if user is defined, then the user is not allowed
						if (result.group && !result.user) {

							if (userFound) {
								console.log('User was found');
								isAllowed = false;
							} else {
								console.log('User was not found, allowed through group');
								isAllowed = true;
							}

						} else if (result.user && !result.group) {
							if (groupFound) {
								console.log('User was found in a group');
								isAllowed = false;
							} else {
								console.log('User was not found in any group, allowed through user');
								isAllowed = true;
							}
						}
						
						done(null, isAllowed);

					});

				});

		} else {
			var err = new Error('Did not find user');
			return done(err);
		}

	};

	schema.pre('save', function(done) {

		var User = $mongoose.model('User'),
			Group = $mongoose.model('Group'),
			AccessControlList = $mongoose.model('AccessControlList'),
			UserAccessControlEntry = $mongoose.model('UserAccessControlEntry');

		var doc = this;

		var accessControlList = new AccessControlList({
			users: [],
			groups: []
		});

		// helpful function to prevent duplicate code

		function saveAccessControlList() {
			accessControlList.save(function(err) {
				if (err) {
					return done(err);
				}
				doc.acl = accessControlList;
				done();

			});
		}

		if ($toastySession.user) {
			var currentUser = $toastySession.user;
			var ace = new UserAccessControlEntry({
				user: currentUser
			});

			ace.save(function(err) {
				if (err) {
					return done(err);
				}
				accessControlList.users.push(ace);
				saveAccessControlList();
			})
		} else {
			saveAccessControlList();
		}

	});
}

module.exports = AccessControlListPlugin;
