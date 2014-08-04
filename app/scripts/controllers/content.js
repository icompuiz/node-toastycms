define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams) {


            $scope.model = {};

            $scope.openNode = function(node) {

                $state.go('management.authenticated.content.edit', {
                    id: node._id
                });

            };

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

                    $scope.model.template = node._id;

                    $scope.contentTemplate = node;

                }, function(reason) {})

            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('content').post($scope.model);

                    requestPromise.then(function(postResult) {

                        $log.debug(postResult);

                        $scope.model = postResult;

                    }, function(error) {

                        $log.error(error);

                    });
                }




            };

            $scope.cancel = function() {

                $state.go('management.authenticated.content.home');

            };

            if ($stateParams.id) {
                Restangular.one('content', $stateParams.id).get().then(function(getResult) {
                    $scope.model = getResult;
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
