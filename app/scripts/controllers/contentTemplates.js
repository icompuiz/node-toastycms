define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTemplatesCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams) {

            $scope.model = {};

            $scope.openNode = function(node) {

                $state.go('management.authenticated.content-templates.edit', {
                    id: node._id
                });

            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $scope.refreshTree();

                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('templates').post($scope.model);

                    requestPromise.then(function(postResult) {

                        $scope.refreshTree();


                        $log.debug(postResult);

                        $scope.model = postResult;

                    }, function(error) {

                        $log.error(error);

                    });
                }




            };

            $scope.refreshTree = function() {
                $rootScope.$broadcast('management.refresh-tree');
            };

            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();

                    $state.go('management.authenticated.content-templates.home', {
                        action: 'remove',
                        result: 'success'
                    });
                });

            };

            $scope.cancel = function() {

                $state.go('management.authenticated.content-templates.home');

            };

            if ($stateParams.id) {
                Restangular.one('templates', $stateParams.id).get().then(function(getResult) {
                    $scope.model = getResult;
                }, function(error) {
                    $log.error(error);
                });
            }


        }
    ]);
});
