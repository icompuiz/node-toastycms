'use strict';

var $mongoose = require('mongoose');
var $async = require('async');
var _ = require('lodash');

var NestableModelPlugin = function(schema, modelName, options) {

    options = options || {
        parent: 'parent',
        children: 'children'
    };

    var schemaProps = {};

    schemaProps[options.parent] = {
        ref: modelName,
        type: $mongoose.Schema.Types.ObjectId
    };

    schemaProps[options.children] = [{
        ref: modelName,
        type: $mongoose.Schema.Types.ObjectId
    }];


    schemaProps.alias = {
        type: String,
        default: '',
        trim: true,
    };

    schema.add(schemaProps);

    schema.methods.getTreeStack = function(returnTreeNodes) {

        var self = this;
        var currentNode = self;
        var Model = $mongoose.model(modelName);
        var stack = [];

        console.log('plugin::NestableModelPlugin::getTreeStack::enter');

        function test() {
            console.log('plugin::NestableModelPlugin::getTreeStack::test::', currentNode === null);
            return currentNode === null;
        }

        function work(callback) {

            console.log('plugin::NestableModelPlugin::getTreeStack::work::enter');

            stack.push(currentNode);

            Model.findOne({
                _id: currentNode[options.parent]
            }).exec(function(err, parentNode) {

                if (err) {
                    callback(err);
                } else {
                    currentNode = parentNode;
                    callback();
                }

            });

        }

        function done(err) {

            if (err) {
                returnTreeNodes(err);
            } else {
                returnTreeNodes(null, stack);
            }

        }

        $async.doUntil(work, test, done);
    };

    schema.methods.removeFromTree = function(parentId, done) {

        var doc = this;

        var Model = $mongoose.model(modelName);

        var pull = {};
        pull[options.children] = doc._id;

        Model.findOneAndUpdate({
            _id: parentId
        }, {
            $pull: pull
        }, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });

    };

    schema.methods.addToTree = function(parentId, done) {

        var doc = this;

        var Model = $mongoose.model(modelName);

        function addToParent() {

            var addToSet = {};
            addToSet[options.children] = doc._id;


            Model
                .findOneAndUpdate({
                        _id: parentId
                    }, {
                        $addToSet: addToSet
                    }, {
                        safe: true
                    },
                    function(err, parent) {
                        console.log('plugin::nestableModel::pre::save::findOneAndUpdate::enter');
                        if (err) {
                            console.log('plugin::nestableModel::pre::save::findOneAndUpdate::error', err);
                            return done(err);
                        }

                        if (!parent) {
                            err = new Error('Specified parent not found');
                            console.log('plugin::nestableModel::pre::save::findOneAndUpdate::error', err);
                            return done(err); // TODO: need to do clean up
                        }

                        console.log('plugin::nestableModel::pre::save::findOneAndUpdate::success');
                        done();
                    });

        }

        Model.findById(parentId).exec(function(err, parent) {

            if (err) {
                done(err);
            } else if (!parent) {
                done(new Error('Parent not found'));
            } else {
                parent.getTreeStack(function(err, stack) {

                    if (err) {
                        done(err);
                    } else if (!stack) {
                        // No stack, add away
                        addToParent();
                    } else {

                        var node = _.find(stack, function(item) {
                            return doc._id.equals(item._id);
                        });

                        if (node) {
                            // node already in tree (don't add)
                            done(new Error('Document cannot be a child of a child'));
                        } else {
                            // add away
                            addToParent();
                        }

                    }

                });
            }

        });



    };

    schema.pre('save', function(done) {
        var doc = this;

        if (_.isEmpty(doc.alias)) {
            doc.alias = doc.name.toLowerCase().replace(/\W/, '_');
        } else {
            doc.alias = doc.alias.toLowerCase().replace(/\W/, '_');
        }


        done();
    });

    schema.methods.getPath = function(callback) {

        var doc = this;

        doc.getTreeStack(function(err, stack) {
            if (err) {
                callback(err);
            } else {
                var path = stack.reverse().map(function(item) {
                    return item.alias.replace(/\W/, '_');
                }).join('/');
                path = '/' + path;
                callback(null, path);
            }
        });

    };

    schema.statics.findByPath = function(path, callback) {

        var Model = this;

        path = path.replace(/^\//, '');
        var aliasStack = path.split('/').reverse();

        var root = {
            parent: null,
            alias: aliasStack.pop()
        };

        var currentNode = null;

        function getNextNode(conditions, done) {

            if (!conditions.alias) {
                done(null, currentNode);
            } else {

                Model.findOne(conditions)
                    .exec(function(err, doc) {
                        if (err) {
                            done(err);
                        } else if (doc) {
                            currentNode = doc;
                            var nextConditions = {
                                parent: doc._id,
                                alias: aliasStack.pop()
                            };
                            getNextNode(nextConditions, done);
                        } else {
                            done(new Error('Not found'));
                        }
                    });
            }
        }

        getNextNode(root, function(err, finalNode) {
            if (err) {
                callback(err);
            } else {
                callback(null, finalNode._id);
            }
        });



    };


    schema.pre('save', function(done) {
        var doc = this;

        if (!doc[options.parent]) {
            return done();
        }

        doc.addToTree(doc[options.parent], done);


    });
    schema.pre('remove', function(preRemoveDone) {
        var doc = this;

        console.log('plugin::nestableModel::pre::remove::enter');
        var Model = $mongoose.model(modelName);

        var conditions = {
            parent: doc._id
        };

        Model.find(conditions).exec(function(err, chidren) {
            $async.each(chidren, function(child, removeNextItem) {

                child.remove(removeNextItem);

            }, preRemoveDone);
        });
    });
    schema.post('remove', function(doc) {

        if (!doc[options.parent]) {
            return;
        }

        var Model = $mongoose.model(modelName);
        var pull = {};
        pull[options.children] = doc._id;

        Model
            .findOneAndUpdate({
                    _id: doc[options.parent]
                }, {
                    $pull: pull
                }, {
                    safe: true
                },
                function(err, parent) {

                    console.log('plugin::nestableModel::post::remove::findOneAndUpdate::enter');
                    if (err) {
                        console.log('plugin::nestableModel::post::remove::findOneAndUpdate::error', err);
                        // return done(err);
                        return;
                    }

                    if (!parent) {
                        err = new Error('Specified parent not found');
                        console.log('plugin::nestableModel::post::remove::findOneAndUpdate::error', err);
                        // return done(err); // TODO: need to do clean up
                        return;
                    }

                    console.log('plugin::nestableModel::post::remove::findOneAndUpdate::success');
                    // done();
                });
    });


};

module.exports = NestableModelPlugin;
