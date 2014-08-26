var modelName = 'Setting';

var $mongoose = require('mongoose'),
    $restful = require('node-restful');

var model = $mongoose.model(modelName);

var resource = $restful
    .model(modelName, model.schema)
    .methods(['get', 'post', 'put', 'delete']);


function register() {
    var accessControlListsController = require('../plugins/accessControlListsController');
    accessControlListsController.plugin(resource, model);

    var deleteRequestInterceptor = require('../plugins/deleteRequestInterceptor');
    deleteRequestInterceptor.plugin(resource, model);

    resource.before('put', function(req, res, next) {

        if (req.body.alias) {
            req.body.alias = req.body.alias.replace(/\W/, '_');
        }

        next();

    });


    return resource;


}

module.exports = {
    resource: resource,
    register: register
};
