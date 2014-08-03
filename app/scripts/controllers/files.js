define(['./module'], function(controllers) {
	'use strict';

    return controllers.controller('FilesCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {

        }
    ]);

});


// define(['./module'], function(controllers) {

//     controllers.controller('', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc','ToastySessionSvc',
//         function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc) {

//         }
//     ]);

// });
