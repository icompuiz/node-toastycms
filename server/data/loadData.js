'use strict';

var $async = require('async'),
    $mongoose = require('mongoose');

var userData = require('./users'),
    groupData = require('./groups'),
    assetData = require('./assets'),
    settingData = require('./settings');


function removeTemplates(doneRemovingTemplates) {
    var Template = $mongoose.model('Template');
    Template.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeTemplates::fail', err);
            return doneRemovingTemplates(err);
        }
        console.log('loadData::removeTemplates::success');
        doneRemovingTemplates();
    });

}

function removeBlocks(doneRemovingBlocks) {
    var Block = $mongoose.model('Block');
    Block.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeBlocks::fail', err);
            return doneRemovingBlocks(err);
        }
        console.log('loadData::removeBlocks::success');
        doneRemovingBlocks();
    });

}

function removeScripts(doneRemovingScripts) {
    var Script = $mongoose.model('Script');
    Script.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeScripts::fail', err);
            return doneRemovingScripts(err);
        }
        console.log('loadData::removeScripts::success');
        doneRemovingScripts();
    });

}

function removeSettings(doneRemovingSettings) {
    var Setting = $mongoose.model('Setting');
    Setting.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeSettings::fail', err);
            return doneRemovingSettings(err);
        }
        console.log('loadData::removeSettings::success');
        doneRemovingSettings();
    });

}

function removeContentTypes(doneRemovingContentTypes) {
    var ContentType = $mongoose.model('ContentType');
    ContentType.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeContentTypes::fail', err);
            return doneRemovingContentTypes(err);
        }
        console.log('loadData::removeContentTypes::success');
        doneRemovingContentTypes();
    });

}

function removeContent(doneRemovingContent) {
    var Content = $mongoose.model('Content');
    Content.remove({}, function(err) {


        if (err) {
            console.log('loadData::removeContent::fail', err);
            return doneRemovingContent(err);
        }
        console.log('loadData::removeContent::success');
        doneRemovingContent();
    });

}


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
    });
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
        User.register(user, password, function(err) {

            if (err) {
                console.log('loadData::addUsers::defineRootUser::fail', err);
                return doneAddingRootUser(err);
            }

            console.log('loadData::addUsers::defineRootUser::success');

            doneAddingRootUser(null, 'addUsers::defineRootUser::sucessful');

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
                doneAddingAdminstratorUser(null, 'addUsers::defineAdministratorUser::sucessful');

            });

        });

    }

    function definePublicUser(doneAddingPublicUser) {

        var publicUser = userData.public;

        var user = new User(publicUser);

        console.log('loadData::addUsers::definePublicUser::enter');
        var password = publicUser.password;
        publicUser.password = null;
        User.register(user, password, function(err, user) {

            if (err) {
                console.log('loadData::addUsers::definePublicUser::fail', err);
                return doneAddingPublicUser(err);
            }

            console.log('loadData::addUsers::definePublicUser::success');

            user.addToGroups(['public'], function(err) {

                if (err) {
                    console.log('loadData::addUsers::definePublicUser::addToGroups::error');
                }
                console.log('loadData::addUsers::definePublicUser::addToGroups::success');
                doneAddingPublicUser(null, 'addUsers::definePublicUser::sucessful');

            });

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
                                return processNextUser(err);
                            }
                            console.log('loadData::addUsers::defineAllUsers::addToGroups::success', groups, userData.username);
                            processNextUser();
                        });
                    } else {
                        console.log('loadData::addUsers::defineAllUsers::success', userData.username);
                        processNextUser();

                    }
                } else {
                    console.log('loadData::addUsers::defineAllUsers::success', userData.username);
                    processNextUser();
                }


            });

        }, function(err) {

            if (err) {
                return doneDefiningAllUsers(err, 'addUsers::defineAllUsers::error');
            }

            doneDefiningAllUsers(null, 'addUsers::defineAllUsers::sucessful');
        });
    }

    $async.series({
        root: defineRootUser,
        administrator: defineAdministratorUser,
        'public': definePublicUser,
        allUsers: defineAllUsers
    }, function(err) {

        if (err) {
            return doneAddingUsers(err, err);
        }
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
        });
    }, function(err) {
        if (err) {
            console.log('loadData::addGroups::error', err);
            return doneAddingGroups(err);
        }
        console.log('loadData::addGroups::success');
        doneAddingGroups(null, 'addGroups::sucessful');
    });
}

function addMocks(doneAddingMocks) {

    console.log('loadData::addMocks::enter');


    var Mock = $mongoose.model('Mock');
    var mock = new Mock({
        field: 'isioma'
    });

    mock.save(function(err) {

        if (err) {
            console.log('loadData::addMocks::error', err);
            return doneAddingMocks(err, 'addMocks::error');

        }
        console.log('loadData::addMocks::success');

        doneAddingMocks(null, 'addMocks::sucessful');

    });
}

function addRootDirectory(doneAddingRootDirectory) {
    var Directory = $mongoose.model('Directory');

    var rootDirectory = {
        name: 'Site Root',
        alias: 'site_root',
        system: true,
    };

    rootDirectory = new Directory(rootDirectory);

    rootDirectory.save(function(err) {
        if (err) {
            console.log('loadData::addRootDirectory::error', err);
            return doneAddingRootDirectory(err, 'addRootDirectory::error');

        }
        console.log('loadData::addRootDirectory::success');

        doneAddingRootDirectory(null, 'addRootDirectory::sucessful');
    });
}

function addSettings(doneAddingSettings) {
    console.log('loadData::addSettings::enter');

    var Setting = $mongoose.model('Setting');

    var settings = settingData.data;

    $async.each(settings, function(currentSetting, processNextSetting) {

        var setting = new Setting(currentSetting);

        setting.save(function(err) {

            if (err) {
                console.log('loadData::addSettings::error', err);
                processNextSetting(err);

            } else {
                console.log('loadData::addSettings::success');
                processNextSetting();
            }


        });

    }, function(err) {
        if (err) {
            console.log('loadData::addMocks::error', err);
            return doneAddingSettings(err, 'addSettings::error');

        }
        console.log('loadData::addSettings::success');

        doneAddingSettings(null, 'addSettings::sucessful');

    });

}

function addAssets(doneAddingAssets) {
    console.log('loadData::addAssets::enter');

    var Asset = $mongoose.model('Route'),
        AccessControlList = $mongoose.model('AccessControlList');

    var assets = assetData.data;

    $async.eachSeries(assets, function(current, processNextAsset) {

        var name = current.name;
        var accessItems = current.items;

        var asset = new Asset({
            path: name
        });


        asset.save(function(err) {

            // add access
            if (err) {
                return processNextAsset(err);
            }

            $async.each(accessItems, function(accessItem, processNextAccessItem) {


                console.log('loadData::addAssets::eachAccessItem::enter for', name);

                function addUsers(doneAddingUsers) {
                    console.log('loadData::addAssets::eachAccessItem::addUsers::enter', name, asset.acl);

                    if (accessItem.users) {

                        AccessControlList
                            .addUsers(asset.acl, accessItem.users, doneAddingUsers);
                    } else {
                        doneAddingUsers();
                    }

                }

                function addGroups(doneAddingGroups) {
                    console.log('loadData::addAssets::eachAccessItem::addGroups::enter', name, asset.acl);

                    if (accessItem.groups) {
                        AccessControlList
                            .addGroups(asset.acl, accessItem.groups, doneAddingGroups);
                    } else {
                        doneAddingGroups();
                    }
                }

                console.log('loadData::addAssets::saveRoute::success', name);
                console.log('loadData::addAssets::saveRoute', 'Adding Users and Groups');

                $async.series({
                    users: addUsers,
                    groups: addGroups
                }, function(err) {
                    if (err) {
                        return processNextAccessItem(err);
                    }

                    processNextAccessItem();
                });

            }, processNextAsset);

        });







    }, function(err) {
        doneAddingAssets(err, 'loadData::addAssets::success');
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
    removeTemplates: removeTemplates,
    removeContentTypes: removeContentTypes,
    removeContent: removeContent,
    removeBlocks: removeBlocks,
    removeScripts: removeScripts,
    removeSettings: removeSettings,
    addGroups: addGroups,
    addUsers: addUsers,
    addAssets: addAssets,
    addRootDirectory: addRootDirectory,
    addMocks: addMocks,
    addSettings: addSettings
};

function main(onDataInitialized) {

    onDataInitialized = onDataInitialized || function() {};

    $async.series(tasks, function(err, results) {

        if (err) {
            console.log(err);
            return onDataInitialized(err);
        }

        console.log(results);

        onDataInitialized();
    });

    // setTimeout(onDataInitialized, 20000);

}

module.exports = {
    run: main,
    tasks: tasks
};
