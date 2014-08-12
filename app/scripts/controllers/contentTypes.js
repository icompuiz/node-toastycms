define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTypesCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$modal', '$stateParams',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $modal, $stateParams) {

            $scope.model = {};

            $scope.contentTemplate = {
                name: 'No Template'
            };

            $scope.openNode = function(node) {

                $state.go('management.authenticated.content-types.edit', {
                    id: node._id
                });

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

                    $state.go('management.authenticated.content-types.home', {
                        action: 'remove',
                        result: 'success'
                    });
                });

            };

            $scope.cancel = function() {

                $state.go('management.authenticated.content-types.home');

            };

            if ($stateParams.id) {
                Restangular.one('types', $stateParams.id).get({
                    populate: 'template'
                }).then(function(getResult) {
                    $scope.model = getResult;
                    if ($scope.model.template) {
                        $scope.contentTemplate = $scope.model.template;
                        $scope.model.template = $scope.contentTemplate._id;
                    }
                }, function(error) {
                    $log.error(error);
                });
            }

        }
    ]);
});
