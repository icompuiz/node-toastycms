define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTypesCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc',
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
