/* global define:true, _: true */

define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('SettingsCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal) {
            $scope.settings = [];

            $scope.addSetting = function() {

                $scope.settings.push({
                    name: '',
                    alias: '',
                    value: ''
                });

            };

            $scope.refreshList = function() {
                Restangular.all('settings').getList().then(function(settings) {
                    $scope.settings = settings;
                });
            };

            $scope.deleteSetting = function(index) {

                var setting = $scope.settings[index];

                if (_.isFunction(setting.remove)) {
                    setting.remove().then($scope.refreshList);
                } else {
                    $scope.settings.splice(index, 1);
                }

            }

            $scope.save = function(setting) {

                async.each($scope.settings, function(setting, saveNext) {

                    if (_.isFunction(setting.put)) {
                        setting.put().then(saveNext);
                    } else {
                        Restangular.all('settings').post(setting).then(saveNext)
                    }
                }, $scope.refreshList);

            };

            $scope.cancel = function() {

                $scope.refreshList();

            };

            $scope.refreshList();
        }
    ]);

});
