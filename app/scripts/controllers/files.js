define(['./module'], function(controllers) {
	'use strict';

    return controllers.controller('FilesCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {
 
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
            }];

        }
    ]);

});


// define(['./module'], function(controllers) {

//     controllers.controller('', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc','ToastySessionSvc',
//         function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {

//         }
//     ]);

// });
