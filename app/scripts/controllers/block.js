define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('BlockCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal) {


            $scope.model = {
                text: 'doctype html\n'
            };

            $scope.treeExplorerOpts = {
                nodrag: true
            };

            $scope.editorOptions = {
                lineNumbers: true,
                mode: 'jade',
                theme: 'cobalt'
            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $scope.refreshTree();
                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('blocks').post($scope.model);

                    requestPromise.then(function(postResult) {

                        $scope.refreshTree();
                        $log.debug(postResult);
                        $scope.model = postResult;
                        $scope.openNode(postResult);

                    }, function(error) {

                        $log.error(error);

                    });
                }
            };

            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();
                    $state.go('^.^.home');
                    $scope.setAlert({
                        type: 'info',
                        msg: 'Block deleted successfully'
                    });
                });


            };

            $scope.cancel = function() {

                $state.go('^.^.home');

            };

            if ($stateParams.id) {
                Restangular.one('blocks', $stateParams.id).get().then(function(getResult) {
                    $scope.model = getResult;
                }, function(error) {
                    $log.error(error);
                });
            }

        }
    ]);

});