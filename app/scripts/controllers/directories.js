define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('DirectoriesCtrl', ['$scope', '$http', '$log', '$state', '$stateParams', 'Restangular', '$modal',
        function($scope, $http, $log, $state, $stateParams, Restangular, $modal) {

            $scope.model = {};


            $scope.parent = null;

            $scope.isSiteRoot = false;

            $scope.siteRoot = null;

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



            $scope.selectDirectory = function() {

                var modalInstance = $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.cancel = false;

                            $scope.apiName = 'fs/directories';


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
                        $scope.model.parent = node._id;

                        $scope.parent = node;
                    }

                }, function() {


                });

            };

            $scope.save = function() {

                if ($scope.model.alias) {
                    $scope.model.alias.trim();
                }

                if ($scope.model._id) {
                    var putRequest = $scope.model.put();

                    putRequest.then(function(putResult) {
                        $scope.refreshTree();
                        $log.debug(putResult);
                    });
                } else {
                    var postRequest = Restangular.all('fs/directories').post($scope.model);

                    postRequest.then(function(postResult) {

                        $scope.refreshTree();
                        $log.debug(postResult);
                        $scope.model = postResult;
                        $scope.openNode(postResult);

                    }, function(error) {

                        $log.error(error);

                    });
                }
            };

            $scope.removeParent = function() {
                $scope.parent = $scope.siteRoot;
                $scope.model.parent = $scope.siteRoot._id;
            };

            $scope.delete = function() {

                $scope.model.remove().then(function() {
                    $scope.refreshTree();
                    $state.go('^.home');
                    $scope.setAlert({
                        type: 'info',
                        msg: 'Directory deleted successfully'
                    });
                });


            };

            $scope.cancel = function() {

                $state.go('^.home');

            };

            function setSiteRoot(callback) {
                callback = callback || angular.noop;

                Restangular.all('fs/directories?alias=site_root').getList({

                    populate: 'children parent'

                }).then(function(getResults) {
                        $scope.siteRoot = getResults[0];

                        if ($scope.siteRoot) {
                            if ($scope.model._id === $scope.siteRoot._id) {
                                $scope.isSiteRoot = true;
                            } else {
                                $scope.parent = $scope.siteRoot;
                                $scope.model.parent = $scope.parent._id;
                            }
                        }

                        callback();

                    },
                    function(error) {
                        $log.error(error);
                        callback();
                    });

            }

            if ($stateParams.id) {
                Restangular.one('fs/directories', $stateParams.id).get({

                    populate: 'children parent'

                }).then(function(getResult) {
                        $scope.model = getResult.clone();

                        setSiteRoot(function() {
                            if (getResult.parent) {
                                $scope.parent = getResult.parent;
                                $scope.model.parent = $scope.parent._id;
                            }
                        });

                        if ($scope.model.alias) {
                            stopWatchingName();
                        }

                    },
                    function(error) {
                        $log.error(error);
                    });
            } else {
                if ($state.is('management.authenticated.directories.home')) {

                    if ($stateParams.alert) {
                        $scope.setAlert($stateParams.alert);
                    }

                } else {
                    setSiteRoot();
                }
            }


        }
    ]);

});
