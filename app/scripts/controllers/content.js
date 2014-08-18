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

            $scope.parent = {

                name: 'No Parent',
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

                $scope.model.properties = _($scope.model.properties).filter(function(property) {

                    var exists = _.find(contentType.properties, {
                        name: property.name
                    });

                    if (exists) {
                        return property;
                    } else {
                        if (!_.isEmpty(property.value)) {
                            return property;
                        }
                    }

                }).value();

            });

            $scope.noType = function() {
                $state.go('^.home');
                $scope.addAlert({
                    type: 'danger',
                    msg: 'A type must be selected'
                });
            };

            $scope.selectParentContent = function() {

                var modalInstance = $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.cancel = false;

                            $scope.apiName = 'content';


                            $scope.modalTitle = 'Select Parent Content';

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

            $scope.selectContentType = function() {

                var modalInstance = $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.cancel = false;

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

                }, function(reason) {

                    $scope.noType();

                })

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
                        $scope.openNode(postResult);

                    }, function(error) {

                        $log.error(error);

                    });
                }
            };

            $scope.openNode = function(node) {

                $state.go('^.edit', {
                    id: node._id
                });

            };

            $scope.removeProperty = function($index) {
                $scope.model.properties[$index].value = null;
            };

            $scope.refreshTree = function() {
                $rootScope.$broadcast('management.refresh-tree');
            };

            $scope.removeParent = function() {
                $scope.parent = {
                    name: 'Not Set'
                };
                $scope.model.parent = null;
            };

            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();

                    $state.go('^.home', {
                        action: 'remove',
                        result: 'success'
                    });
                });


            };

            $scope.cancel = function() {

                $state.go('^.home');

            };

            if ($stateParams.id) {
                Restangular.one('content', $stateParams.id).get({
                    
                    populate: 'type parent'

                }).then(function(getResult) {
                    $scope.model = getResult;
                    if ($scope.model.type) {

                        $scope.contentType = $scope.model.type;
                        $scope.model.type = $scope.contentType._id;

                    }

                    if ($scope.model.parent) {
                        $scope.parent = $scope.model.parent;
                        $scope.model.parent = $scope.parent._id;

                    }
                }, function(error) {
                    $log.error(error);
                });
            } else {
                if ($state.is("management.authenticated.content.home")) {

                    if ($stateParams.alert) {
                        $scope.addAlert($stateParams.alert);
                    }

                } else if ($state.is("management.authenticated.content.add")) {
                    $scope.selectContentType();
                }
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
