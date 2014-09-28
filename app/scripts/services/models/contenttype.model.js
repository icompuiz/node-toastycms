/* globals define: true  */
define(['./module'], function (models) {
	'use strict';
	models.service('ContentTypeModel', ['ModelFactory', function(ModelFactory) {
		// privates
		var ContentTypeModel = ModelFactory.create('types');
		return ContentTypeModel;
	}]);
});