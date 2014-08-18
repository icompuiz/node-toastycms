'use strict';

var $mongoose = require('mongoose');
var $async = require('async');
var _ = require('lodash');

var NestableModelPlugin = function(schema, modelName) {

    schema.add({
        parent: {
            ref: modelName,
            type: $mongoose.Schema.Types.ObjectId
        },
        children: [{
            ref: modelName,
            type: $mongoose.Schema.Types.ObjectId
        }]
    });

    schema.methods.getTreeStack = function(returnTreeNodes) {

        var self = this;
        var currentNode = self;
        var Model = self.constructor;
        var stack = [];

        console.log('plugin::NestableModelPlugin::getTreeStack::enter');

        function test() {
            console.log('plugin::NestableModelPlugin::getTreeStack::test::');
            return currentNode === null;
        }

        function work(callback) {

            console.log('plugin::NestableModelPlugin::getTreeStack::work::enter');

            stack.push(currentNode);

            Model.findById(currentNode.parent).exec(function(err, parentNode) {

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

        Model.findOneAndUpdate({
            _id: parentId
        }, {
            $pull: {
                children: doc._id
            }
        }, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });

    }

    schema.methods.addToTree = function(parentId, done) {

        var doc = this;

        var Model = $mongoose.model(modelName);

        function addToParent() {

            Model
                .findOneAndUpdate({
                        _id: parentId
                    }, {
                        $addToSet: {
                            children: doc._id
                        }
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

        if (!doc.parent) {
            return done();
        }

        doc.addToTree(doc.parent, done);


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

        if (!doc.parent) {
            return;
        }

        var Model = $mongoose.model(modelName);
        Model
            .findOneAndUpdate({
                    _id: doc.parent
                }, {
                    $pull: {
                        children: doc._id
                    }
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
