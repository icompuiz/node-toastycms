var modelName = 'Directory';

var $mongoose = require('mongoose'),
    $restful = require('node-restful'),
    $path = require('path'),
    _ = require('lodash');

var model = $mongoose.model(modelName),
    File = $mongoose.model('File'),
    FileCtrl = require('./file.js');

AccessControlList = $mongoose.model('AccessControlList');

var resource = $restful
    .model(modelName, model.schema)
    .methods(['get', 'post', 'put', 'delete']);


function register() {
    var accessControlListsController = require('../plugins/accessControlListsController');
    accessControlListsController.plugin(resource, model);

    // add file to this directory
    // Access Control: update 
    resource.route('files.post', {
        detail: true,
        handler: function(req, res, next) {

            // var onAllowed = function onAllowed(directory) {

            req.body.directory = req.params.id;

            FileCtrl.handleFileUpload(req, res, next); // single place to handle file upload case
            // };

            // handleFileUpload('update', req, res, onAllowed);

        }
    });

    // Access Control: remove 
    resource.before('delete', function(req, res, next) {


        console.log('controller::directory::before::delete::enter');

        model.findById(req.params.id).exec(function(err, directory) {

            if (err) {
                console.log('controller::directory::before::delete::findById::err', err);
                return res.send(400, err.message || err);
            }


            if (!directory) {
                err = new Error('Directory not found');
                console.log('controller::directory::before::delete::findById::err', err);
                return res.send(404, err.message || err);
            }

            if (directory.system) {

                console.log('System directories cannot be deleted')
                err = new Error('System directories cannot be deleted');
                return res.send(400, err.message || err);

            }

            directory.remove(function(err) {
                if (err) {
                    console.log('controller::directory::before::delete::findById::remove::err');
                    return res.send(200, err.message);
                }
                console.log('controller::directory::before::delete::findById::remove::success');
                res.json(200, directory);
            });

        });
    });

    resource.before('get', function(req, res, next) {

        if (!req.params.id) {
            req.quer.where({

                $or: [{
                    directory: {
                        $exists: false
                    }
                }, {
                    directory: null
                }]
            });
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

    return resource;


}


module.exports = {
    resource: resource,
    register: register
};
