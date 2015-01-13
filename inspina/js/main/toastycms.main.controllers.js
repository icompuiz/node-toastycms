/* global define: true */

'use strict';
define(['./_mod'], function(controllers) {

	controllers.controller('MainCtrl', [function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

	}]);

});