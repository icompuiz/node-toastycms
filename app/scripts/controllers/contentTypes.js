define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTypesCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$modal', '$stateParams',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $modal, $stateParams) {

            $scope.model = {};

            $scope.contentTemplate = {
                name: 'No Template'
            };

            $scope.parent = {

                name: 'No Parent',
            };
            $scope.selectParentContentType = function() {

                var modalInstance = $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.cancel = false;

                            $scope.apiName = 'types';


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

            $scope.selectContentTemplate = function() {

                var modalInstance = $modal.open({
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.apiName = 'templates';

                            $scope.modalTitle = 'Select Template';

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

                    $scope.model.template = node._id;

                    $scope.contentTemplate = node;

                }, function(reason) {})

            };

            $scope.addProperty = function() {

                if (!_.isArray($scope.model.properties)) {
                    $scope.model.properties = [];
                };

                var property = {
                    name: '',
                    format: 'text'
                };

                $scope.model.properties.push(property);

            };

            $scope.removeProperty = function(index) {

                if (_.isArray($scope.model.properties)) {

                    $scope.model.properties.splice(index, 1);

                }

            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $scope.refreshTree();

                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('types').post($scope.model);

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
                        msg: 'Type deleted successfully'
                    });
                });

            };

            $scope.cancel = function() {

                $state.go('^.home');

            };

            if ($stateParams.id) {
                Restangular.one('types', $stateParams.id).get({
                    populate: 'template parent'
                }).then(function(getResult) {
                    $scope.model = getResult;
                    if ($scope.model.template) {
                        $scope.contentTemplate = $scope.model.template;
                        $scope.model.template = $scope.contentTemplate._id;
                    }
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
