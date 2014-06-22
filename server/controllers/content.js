var modelName = 'Content';

var $mongoose = require('mongoose'),
    $restful = require('node-restful');

var model = $mongoose.model(modelName);

var resource = $restful
    .model(modelName, model.schema)
    .methods(['get', 'post', 'put', 'delete']);


function register() {
    var accessControlListsController = require('../plugins/accessControlListsController');
    accessControlListsController.plugin(resource, model);

    var modelDeleteIntecept = require('../plugins/modelDeleteIntercept');
    modelDeleteIntecept.plugin(resource, model);

    return resource;


}

module.exports = {
    resource: resource,
    register: register
};
