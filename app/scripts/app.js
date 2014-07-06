/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define('app', [
    'angular',
    'angular-ui-router',
    'angular-bootstrap',
    // 'text!',
    './controllers/index',
    './directives/index',
    './services/index',
    './states/index'
], function (ng) {
    'use strict';

    return ng.module('toastycms', [
        'toastycms.controllers',
        'toastycms.directives',
        'toastycms.services',
        'toastycms.states',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router'
    ]).run(function($state, $rootScope) {

        console.log('HERE!!');

        $state.go('home');
    });
});
