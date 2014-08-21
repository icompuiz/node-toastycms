define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTemplatesCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams','$modal',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal) {

            $scope.model = {};

            $scope.parent = {

                name: 'No Parent',
            };

            $scope.editorOptions = {
                lineNumbers: true,
                mode: 'htmlmixed',
                theme: 'cobalt'
            };

            $scope.selectParentContentTemplate = function() {

                var modalInstance = $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.cancel = false;

                            $scope.apiName = 'templates';


                            $scope.modalTitle = 'Select Parent Type';

                            $scope.selectedNode = {};


                            $scope.onSelected = function(node) {

                                $scope.selectedNode = node;

                            };


                            $scope.ok = function() {
                                $modalInstance.close($scope.selectedNode);
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                        }
                    ]
                });

                modalInstance.result.then(function(node) {

                    if (node._id !== $scope.model._id) {
                        $scope.model.parent = node._id;

                        $scope.parent = node;
                    }

                }, function(reason) {


                });

            };

            $scope.removeParent = function() {
                $scope.parent = {
                    name: 'Not Set'
                };
                $scope.model.parent = null;
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
                        $scope.openNode(postResult);


                    }, function(error) {

                        $log.error(error);

                    });
                }




            };
            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();
                    $state.go('^.home');
                    $scope.setAlert({
                        type: 'info',
                        msg: 'Template deleted successfully'
                    });
                });

            };

            $scope.cancel = function() {

                $state.go('^.home');

            };

            if ($stateParams.id) {
                Restangular.one('templates', $stateParams.id).get({
                    populate: 'parent'
                }).then(function(getResult) {
                    $scope.model = getResult;
                    if ($scope.model.parent) {
                        $scope.parent = $scope.model.parent;
                        $scope.model.parent = $scope.parent._id;

                    }

                }, function(error) {
                    $log.error(error);
                });
            }

        }
    ]);
});
