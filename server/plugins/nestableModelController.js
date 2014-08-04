'use strict';

var mongoose = require('mongoose');

var NestableModelControler = function(resource, model) {

    resource.before('get', function(req, res, next) {

        if (!req.params.id) {
            req.quer.where({
                parent: {
                    $exists: false
                }
            })
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

            if (req.body.parent) {

                if (req.body.parent !== doc.parent) {

                    console.log(model.schema.paths);

                    var parentModelName = model.schema.paths.parent.options.ref;

                    var ParentModel = mongoose.model(parentModelName);

                    ParentModel.findOneAndUpdate({
                        _id: req.body.parent
                    }, {
                        $push: {
                            children: doc._id
                        }
                    }, function(err, updated) {
                        if (err) {
                            res.send(400, err.message);
                        } else {
                            next();
                        }
                    });
                }

            } else {
                next();
            }


        });
    });


};

module.exports = {
    plugin: NestableModelControler
};
