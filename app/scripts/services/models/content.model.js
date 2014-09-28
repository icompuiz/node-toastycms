/* globals define: true  */
define(['./module'], function (models) {
	'use strict';

	models.service('ContentModel', ['ModelFactory', function(ModelFactory) {

		// privates
		var ContentModel = ModelFactory.create('content');

		return ContentModel;


	}]);

});