define(['./module'], function(controllers) {

    controllers.controller('ContentCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {
            $scope._toggle = function(scope) {
            	console.log('Toggling', scope.node.title);
                scope.toggle();
            };
            $scope.data = [{
                title: 'Root Element',
                nodes: [{
                    title: 'Level 1',
                    nodes: [{
                        title: 'Level 2',
                        nodes: [{
                            title: 'Level 3',
                            nodes: [{
                                title: 'Level 4'
                            }]
                        }]
                    }]
                }]
            }]

        }
    ]);

});


// define(['./module'], function(controllers) {

//     controllers.controller('', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc','ToastySessionSvc',
//         function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {

//         }
//     ]);

// });
