define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTypesCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$modal',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $modal) {

            $scope.model = {};

            $scope.contentTemplate = {
                name: 'No Template'
            };

            $scope.selectContentTemplate = function() {

                var modalInstance = $modal.open({
                    templateUrl: 'partials/management/modal/treeExplorerModal',
                    controller: ['$scope', '$modalInstance',
                        function($scope, $modalInstance) {

                            $scope.apiName = 'contenttemplates';

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

            $scope.save = function() {

            };

            $scope.cancel = function() {

            };

        }
    ]);
});
