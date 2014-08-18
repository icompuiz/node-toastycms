define(['./module'], function(directives) {
    'use strict';

    directives.directive('treePopulate', [

        function() {

            var directive = {
                require: '^uiTreeNode',
                restrict: 'A',
                controller: ['$scope', 'Restangular', function($scope, Restangular) {

                    if (_.isString($scope.node)) {
                        Restangular.one($scope.tApi, $scope.node).get().then(function(node) {
                            $scope.node = node;
                        });
                    }

                }]

            };

            return directive;
        }
    ]);

});
