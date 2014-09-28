/* globals _:true, define: true  */
define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('AddContentTypesCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$modal', '$stateParams', 'ContentTypeModel',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $modal, $stateParams, ContentTypeModel) {

            /// private variable definitions
            var completeInitialization = function completeInitialization(model) {

                if (model.template) {
                    $scope.contentTemplate = model.template;
                    model.template = $scope.contentTemplate._id;
                }
                if (model.parent) {
                    $scope.parent = model.parent;
                    model.parent = $scope.parent._id;

                }

            };
            /// end - private variable definitions

            /// Scope variable definitions
            var defaults = {};

            $scope.contentTemplate = {
                name: 'No Template'
            };

            $scope.parent = {
                name: 'No Parent',
            };
            /// end - Scope variable definitions


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

                }, function() {


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

                }, function() {});

            };

            $scope.addProperty = function() {

                if (!_.isArray($scope.model.properties)) {
                    $scope.model.properties = [];
                }

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
                var requestPromise = ContentTypeModel.save();
                requestPromise.then(function(result) {
                    $scope.refreshTree();
                    $log.debug(result);
                    $scope.model = result;
                    ContentTypeModel.reset();
                    $scope.openNode(result);
                }, function(error) {
                    $log.error(error);
                });

            };

            $scope.delete = function() {
                ContentTypeModel.remove().then(function() {
                    $scope.refreshTree();
                    $state.go('^.home');
                    $scope.setAlert({
                        type: 'info',
                        msg: 'Type deleted successfully'
                    });
                });

            };

            $scope.cancel = function() {
                ContentTypeModel.reset();
                $state.go('^.home');
            };

            /// Initialize current context
            if ($stateParams.id) {
                var options = {                    
                    populate: 'template parent'
                };

                ContentTypeModel.read($stateParams.id, options, true).then(function() {
                    $scope.model = ContentTypeModel.current;
                    completeInitialization($scope.model);
                    // equivalent to $scope.model = data; where data is the first argument passed to this callback
                });
            }
            
            if (_.isEmpty($scope.model)) {
                $scope.model = ContentTypeModel.init(defaults);
            }
            /// end - Initialize current context

        }
    ]);
});
