'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var NestableModelControler = function(resource, model, options) {

    if (_.isString(model)) {
        model = mongoose.model(model);
    }

    options = options || {
        parent: 'parent',
        children: 'children'
    };

    resource.route('path.get', {
        handler: function(req, res, next) {

            var path = req.params.path;

            model.findByPath(path, function(error, node) {

                if (error) {
                    return req.jsonp(400, error);
                }

                return req.jsonp(200, node);

            })

        }
    });

    resource.route('tree.get', {
        detail: true,
        handler: function(req, res) {

            var id = req.params.id;

            model.findById(id).exec(function(err, doc) {

                if (err) {
                    res.send(400, err);
                } else if (doc) {

                    doc.getTreeStack(function(err, treeStack) {

                        if (err) {
                            res.send(400, err);
                        } else {

                            res.jsonp(treeStack);

                        }

                    });

                } else {
                    res.send(404, 'Not found');
                }

            });

        }
    });

    resource.before('get', function(req, res, next) {

        if (!req.params.id) {

            var conditions = {
                $or: []
            };

            var opt = {};
            opt[options.parent] = {
                $exists: false
            };

            conditions.$or.push(opt);

            opt[options.parent] = null;


            req.quer.where(conditions);
        }

        next();

    });

    resource.before('put', function(req, res, next) {

        if (_.isEmpty(req.body.alias)) {
            req.body.alias = req.body.name.toLowerCase().replace(/\W/, '_');
        } else {
            req.body.alias = req.body.alias.toLowerCase().replace(/\W/, '_');
        }


        next();

    });

    // Access Control: remove 
    resource.before('put', function(req, res, next) {


        console.log('plugin::NestableModelControler::before::put::enter');

        model.findById(req.params.id).exec(function(err, doc) {

            if (err) {
                console.log('plugin::NestableModelControler::before::put::findById::err', err);
                return res.send(500, err.message || err);
            }

            if (!doc) {
                err = new Error('Model not found');
                console.log('plugin::NestableModelControler::before::put::findById::err', err);
                return res.send(404, err.message || err);
            }

            var parentId = req.body[options.parent];

            function addToTree() {
                doc.addToTree(parentId, function(err) {
                    if (err) {
                        res.send(400, err.message || err);
                    } else {
                        next();
                    }
                });
            }

            if (parentId) { // case 1

                if (!doc[options.parent]) {
                    // continue
                    addToTree();
                } else if (doc._id.equals(parentId)) {
                    // remove the property from the body
                    res.send(400, 'Cannot be a child of itself');
                } else if (!doc[options.parent].equals(parentId)) {
                    doc.addToTree(parentId, function(err) {
                        if (err) {
                            res.send(400, err.message || err);
                        } else {
                            doc.removeFromTree(doc[options.parent], function(err) {
                                if (err) {
                                    res.send(400, err.message || err);
                                } else {
                                    next();
                                }
                            });
                        }
                    });
                } else {
                    next();
                }

            } else { // case 2

                req.body[options.parent] = null;

                if (!doc[options.parent]) {
                    next();
                } else {
                    doc.removeFromTree(doc[options.parent], function(err) {
                        if (err) {
                            res.send(400, err.message || err);
                        } else {
                            next();
                        }
                    });
                }

            }

        });
    });


};

module.exports = {
    plugin: NestableModelControler
};
