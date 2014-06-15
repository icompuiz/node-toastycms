'use strict';

var _ = require('lodash'),
    $async = require('async'),
    $lodash = require('lodash'),
    $mongoose = require('mongoose'),
    $routes = require('../routes');

var userData =  require('./users'),
	groupData = require('./groups');

 var randomString = function random (length) {
 	// body...
 	length = length || 5;
 	return Math.random().toString(36).substring(7).substring(0,length);
 };

function removeDirectories(doneRemovingDirectories) {

    var Directory = $mongoose.model('Directory');
    Directory.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeDirectories::fail', err);
            return doneRemovingDirectories(err);
        }
        console.log('loadData::removeDirectories::success');
        doneRemovingDirectories();
    });

}

function removeFiles(doneRemovingFiles) {

    var File = $mongoose.model('File');
    File.remove({}, function(err) {

        if (err) {
            console.log('loadData::removeFiles::fail', err);
            return doneRemovingFiles(err);
        }
        console.log('loadData::removeFiles::success');
        doneRemovingFiles();

    });

}

function removeRoutes(doneRemovingRoutes) {
    var Route = $mongoose.model('Route');
    Route.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeRoutes::fail', err);
            return doneRemovingRoutes(err);
        }
        console.log('loadData::removeRoutes::success');
        doneRemovingRoutes();
    })
}

function removeMockObjects(doneRemovingMocks) {
    var Mock = $mongoose.model('Mock');
    Mock.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeMocks::fail', err);
            return doneRemovingMocks(err);
        }
        console.log('loadData::removeMocks::success');

        doneRemovingMocks();
    });

}

function removeAccessControlLists(doneRemovingACLs) {

    var ACL = $mongoose.model('AccessControlList');
    ACL.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeACLs::fail', err);
            return doneRemovingACLs(err);
        }
        console.log('loadData::removeACLs::success');

        doneRemovingACLs();
    });

}

function removeAccessControlEntries(doneRemovingACEs) {

    var ACE = $mongoose.model('AccessControlEntry');
    ACE.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeACEs::fail', err);
            return doneRemovingACEs(err);
        }
        console.log('loadData::removeACEs::success');

        doneRemovingACEs();
    });
}

function removeGroups(doneRemovingGroups) {
    var Group = $mongoose.model('Group');

    console.log('loadData::removeGroups::enter');


    Group.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeGroups::fail', err);
            return doneRemovingGroups(err);
        }
        console.log('loadData::removeGroups::success');

        doneRemovingGroups();
    });
}

function removeUsers(doneRemovingUsers) {
    var User = $mongoose.model('User');
    console.log('loadData::removeUsers::enter');

    User.remove({}, function(err) {
        if (err) {
            console.log('loadData::removeUsers::fail', err);
            return doneRemovingUsers(err);
        }

        console.log('loadData::removeUsers::success');
        doneRemovingUsers();
    });
}

function addUsers(doneAddingUsers) {

    var User = $mongoose.model('User');

    function defineRootUser(doneAddingRootUser) {
        var root = userData.root;

        console.log('loadData::addUsers::defineRootUser::enter');
        var password = root.password;
        root.password = null;
        var user = new User(root);
        User.register(user, password, function(err, user) {

            if (err) {
                console.log('loadData::addUsers::defineRootUser::fail', err);
                return doneAddingRootUser(err);
            }

            console.log('loadData::addUsers::defineRootUser::success');

            doneAddingRootUser();

        });

    }

    function defineAdministratorUser(doneAddingAdminstratorUser) {
        var administrator = userData.administrator;

        var user = new User(administrator);

        console.log('loadData::addUsers::defineAdministratorUser::enter');
        var password = administrator.password;
        administrator.password = null;
        User.register(user, password, function(err, user) {

            if (err) {
                console.log('loadData::addUsers::defineAdministratorUser::fail', err);
                return doneAddingAdminstratorUser(err);
            }

            console.log('loadData::addUsers::defineAdministratorUser::success');

            user.addToGroups(['administrators'], function(err) {

                if (err) {
                    console.log('loadData::addUsers::defineAdministratorUser::addToGroups::error');
                }
                console.log('loadData::addUsers::defineAdministratorUser::addToGroups::success');
                doneAddingAdminstratorUser();

            });

            // doneAddingAdminstratorUser();

        });

    }

    function defineAllUsers(doneDefiningAllUsers) {
        var all = userData.all;
        console.log('loadData::addUsers::defineAllUsers::enter');
        $async.each(all, function(userData, processNextUser) {

            var user = new User(userData);
              var password = userData.password;
       		 userData.password = null;
            User.register(user, password, function(err, newUser) {

                if (err) {
                    console.log('loadData::addUsers::defineAllUsers::fail', userData.username, err);
                    return processNextUser(err);
                }
                if (userData.options) {
                    if (userData.options.groups) {
                        var groups = userData.options.groups;
                        newUser.addToGroups(groups, function(err) {
                            if (err) {
                                console.log('loadData::addUsers::defineAllUsers::addToGroups::error', groups, userData.username);
                            }
                            console.log('loadData::addUsers::defineAllUsers::addToGroups::success', groups, userData.username);
                            processNextUser();
                        });
                    } else {
                        processNextUser();

                    }
                } else {
                    processNextUser();
                }

                console.log('loadData::addUsers::defineAllUsers::success', userData.username);

            });

        }, function(err) {
            doneDefiningAllUsers();
        });
    }

    $async.series({
        root: defineRootUser,
        administrator: defineAdministratorUser,
        allUsers: defineAllUsers
    }, function(err, results) {
        doneAddingUsers();
    });


}

function addGroups(doneAddingGroups) {
    console.log('loadData::addGroups::enter');

    var Group = $mongoose.model('Group');
    var groups = groupData.data;

    $async.each(groups, function(groupData, processNextGroup) {
        var group = new Group(groupData);
        group.save(function(err) {
            if (err) {
                console.log('loadData::addGroups::error', groupData.name);
                return processNextGroup(err);
            }
            console.log('loadData::addGroups::success', groupData.name);
            processNextGroup();
        })
    }, function(err) {
        if (err) {
            console.log('loadData::addGroups::error', err);
            return doneAddingGroups(err);
        }
        console.log('loadData::addGroups::success');
        doneAddingGroups();
    });
}

function addMocks(done) {

    console.log('loadData::addMocks::enter');


    var Mock = $mongoose.model('Mock');	
    var mock = new Mock({
        field: 'isioma'
    });

    mock.save(function(err) {

    	if (err) {
            console.log('loadData::addMocks::error', err);

    	}
        console.log('loadData::addMocks::success');

    	done(null, {});

    });
}

function addRoutes(doneAddingRoutes) {
    console.log('loadData::addRoutes::enter');

    var routes = $routes.apiRoutes;

    var Route = $mongoose.model('Route'),
        AccessControlList = $mongoose.model('AccessControlList'),
        User = $mongoose.model('User'),
        UserAccessControlEntry = $mongoose.model('UserAccessControlEntry'),
        Group = $mongoose.model('Group'),
        GroupAccessControlEntry = $mongoose.model('GroupAccessControlEntry');

    $async.each(routes, function(routeData) {

        console.log('loadData::addRoutes::each::enter');


        var route = new Route({
            path: routeData.path
        });

        function addUsers(doneAddingUsers) {
            console.log('loadData::addRoutes::each::addUsers::enter', route.acl);
            AccessControlList
                .addUsers(route.acl, routeData.access.users, doneAddingUsers);
        }

        function addGroups(doneAddingGroups) {
            console.log('loadData::addRoutes::each::addGroups::enter', route.acl);
            AccessControlList
                .addGroups(route.acl, routeData.access.groups, doneAddingGroups)
        }

        route.save(function(err) {



            // add access
            if (err) {
                return doneAddingRoutes(err);
            }

            if (routeData.access) {

                console.log('loadData::addRoutes::saveRoute::success', routeData.path);
                console.log('loadData::addRoutes::saveRoute', 'Adding Users and Groups');
                $async.series({
                    users: addUsers,
                    groups: addGroups
                }, function(err, results) {
                    if (err) {
                        return doneAddingRoutes(err);
                    }

                    doneAddingRoutes(null, results);
                });

            }

        });

    });
}

var tasks = {
    removeUsers: removeUsers,
    removeGroups: removeGroups,
    removeDirectories: removeDirectories,
    removeFiles: removeFiles,
    removeAccessControlLists: removeAccessControlLists,
    removeAccessControlEntries: removeAccessControlEntries,
    removeRoutes: removeRoutes,
    removeMockObjects: removeMockObjects,
    addGroups: addGroups,
    addUsers: addUsers,
    addRoutes: addRoutes,
    addMocks: addMocks
};

function main(dataInitialized) {
    var steps = $lodash.values(tasks);
    $async.series(steps, function(err, results) {
        console.log('loadData::complete');
        dataInitialized();
    });
}

module.exports = {
    run: main,
    tasks: tasks
};