define(['./module'], function(controllers) {
        'use strict';

        return controllers.controller('FilesCtrl', ['$scope', '$http', '$log', '$state', '$stateParams', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc',
            function($scope, $http, $log, $state, $stateParams, Restangular, AuthenticationSvc, ToastySessionSvc) {

                $scope.model = {};


                $scope.directory = {
                    name: 'Site Root',
                };

                $scope.treeExplorerOpts = {
                    children: 'files',
                    parent: 'directory'
                };

                $scope.alias = '';

                var stopWatchingName = $scope.$watch('model.name', function(newValue) {
                    if (!_.isEmpty(newValue)) {
                        $scope.model.alias = newValue.toLowerCase().replace(/\W/, '_');
                    }
                });

                $scope.$watch('model.alias', function(newValue) {
                    if (!_.isEmpty(newValue)) {
                        $scope.model.alias = newValue.replace(/\W/, '_');
                    }
                });

                var flag = true;

                $scope.aliasManuallyChanged = function() {
                    if (flag) {
                        stopWatchingName();
                        flag = false;
                    }
                };

                $scope.openNode = function(node) {

                    $state.go('^.edit', {
                        id: node._id,
                        type: node.__t
                    });

                };



                $scope.selectDirectory = function() {

                    var modalInstance = $modal.open({
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: 'partials/management/modal/treeExplorerModal',
                        controller: ['$scope', '$modalInstance',
                            function($scope, $modalInstance) {

                                $scope.cancel = false;

                                $scope.apiName = 'directory';


                                $scope.modalTitle = 'Select Directory';

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
                            $scope.model.directory = node._id;

                            $scope.directory = node;
                        }

                    }, function() {


                    });

                };

                $scope.save = function() {

                    if ($scope.model.alias) {
                        $scope.model.alias.trim();
                    }

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

                $scope.removeProperty = function($index) {
                    $scope.model.properties[$index].value = null;
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
                        $state.go('^.home');
                        $scope.setAlert({
                            type: 'info',
                            msg: 'Content deleted successfully'
                        });
                    });


                };

                $scope.cancel = function() {

                    $state.go('^.home');

                };

                if ($stateParams.id) {
                    Restangular.one('fs/directories', $stateParams.id).get({

                        populate: 'files directory'

                    }).then(function(getResult) {
                        $scope.model = getResult;

                        if ($scope.model.directory) {
                            $scope.directory = $scope.model.directory;
                            $scope.model.directory = $scope.directory._id;

                        }

                        if ($scope.model.alias) {
                            stopWatchingName();
                        }

                    },
                    function(error) {
                        $log.error(error);
                    });
            } else {
                if ($state.is("management.authenticated.content.home")) {

                    if ($stateParams.alert) {
                        $scope.setAlert($stateParams.alert);
                    }

                } else if ($state.is("management.authenticated.content.add")) {
                    $scope.selectContentType();
                }
            }


        }]);

});
