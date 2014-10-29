/* global define:true, _: true */

define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('AddContentCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal','ContentModel',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal, ContentModel) {

            /// private variable definitions
            var defaults = {
                properties: []
            };

            var unwatchName = angular.noop;

            var addObservers = function() {

                if (_.isEmpty($scope.model.type)) {
                    $scope.selectContentType();
                }

                /// Initialize Observers
                unwatchName = $scope.$watch('model.name', function(newNameValue) {
                    if (!_.isEmpty(newNameValue)) {
                        $scope.model.alias = newNameValue.toLowerCase().replace(/\W/, '_');
                    }
                });

                $scope.$watch('model.alias', function(newAliasValue) {
                    if (!_.isEmpty(newAliasValue)) {
                        $scope.model.alias = newAliasValue.replace(/\W/, '_');
                    }
                });

                var aliasManuallyChangedFlag = true;
                
                $scope.aliasManuallyChanged = function() {
                    if (aliasManuallyChangedFlag) {
                        unwatchName();
                        aliasManuallyChangedFlag = false;
                    }
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
                /// end - Initialize Observers

            };


            var completeInitialization = function completeInitialization(model) {

                if (model.type) {

                    $scope.contentType = model.type;
                    model.type = $scope.contentType._id;

                }

                if (model.parent) {
                    $scope.parent = model.parent;
                    model.parent = $scope.parent._id;

                }

                if (model.alias) {
                    unwatchName();
                }

                addObservers();

            };
            /// end - private variable definitions

            /// Scope Variable definitions
            $scope.contentType = {
                name: 'No Type',
                properties: []
            };

            $scope.alias = '';

            $scope.parent = {
                name: 'No Parent',
            };
            /// end - Scope Variable definitions


            /// Initialize $scope functions
            $scope.noType = function() {
                ContentModel.reset();
                $state.go('^.home');
                $scope.setAlert({
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

                }, function() {


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

                }, function() {

                    $scope.noType();

                });

            };

            $scope.save = function() {

                if ($scope.model.alias) {
                    $scope.model.alias.trim();
                }

                var requestPromise = ContentModel.save();
                requestPromise.then(function(result) {
                    $scope.refreshTree();
                    $log.debug(result);
                    $scope.model = result;
                    ContentModel.reset();
                    $scope.openNode(result);
                }, function(error) {
                    $log.error(error);
                });
                
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

                ContentModel.remove().then(function() {
                    $scope.refreshTree();
                    $state.go('^.home');
                    $scope.setAlert({
                        type: 'info',
                        msg: 'Content deleted successfully'
                    });
                });


            };

            $scope.cancel = function() {
                ContentModel.reset();
                $state.go('^.home');

            };
            /// end - Initialize $scope functions

            /// Initialize current context
            if ($stateParams.id) {
                var options = {
                    
                    populate: 'type parent'

                };
                ContentModel.read($stateParams.id,options, true).then(function() {
                    $scope.model = ContentModel.current;
                    completeInitialization($scope.model);
                    // equivalent to $scope.model = data; where data is the first argument passed to this callback
                });
            } else {
                $scope.model = ContentModel.init(defaults);
                addObservers();
                
            }
            
            /// end - Initialize current context


        }
    ]);

});