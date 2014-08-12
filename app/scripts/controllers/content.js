define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal) {


            $scope.model = {
                properties: []
            };

            $scope.contentType = {
                name: 'No Type',
                properties: []
            };


            $scope.openNode = function(node) {

                $state.go('management.authenticated.content.edit', {
                    id: node._id
                });

            };

            $scope.$watch('contentType', function(contentType) {

                _(contentType.properties).forEach(function(property) {

                    var exists = _.find($scope.model.properties, {
                        name: property.name
                    });

                    if (!exists) {
                        property = _.clone(property);
                        delete property._id;
                        $scope.model.properties.push(property);
                    }

                });

            });

            $scope.selectContentType = function() {

                var modalInstance = $modal.open({
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.apiName = 'types';

                            $scope.modalTitle = 'Select Type';

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

                    $scope.model.type = node._id;

                    $scope.contentType = node;

                }, function(reason) {})

            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $scope.refreshTree();
                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('content').post($scope.model);

                    requestPromise.then(function(postResult) {

                        $scope.refreshTree();
                        $log.debug(postResult);
                        $scope.model = postResult;

                    }, function(error) {

                        $log.error(error);

                    });
                }




            };

            $scope.removeProperty = function($index) {

                $scope.model.properties[$index].value = null;

            };

            $scope.refreshTree = function() {
                $rootScope.$broadcast('management.refresh-tree');
            };

            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();

                    $state.go('management.authenticated.content.home', {
                        action: 'remove',
                        result: 'success'
                    });
                });


            };

            $scope.cancel = function() {

                $state.go('management.authenticated.content.home');

            };

            if ($stateParams.id) {
                Restangular.one('content', $stateParams.id).get({
                    populate: 'type'
                }).then(function(getResult) {
                    $scope.model = getResult;
                    if ($scope.model.type) {
                        $scope.contentType = $scope.model.type;
                        $scope.model.type = $scope.contentType._id;

                    }
                }, function(error) {
                    $log.error(error);
                });
            }

        }
    ]);

});


// define(['./module'], function(controllers) {

//     controllers.controller('', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc','ToastySessionSvc',
//         function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {

//         }
//     ]);

// });
