define(['./module'], function(directives) {
    'use strict';

    directives.directive('toastyTreeExplorer', [

        function() {

            var directive = {
                restrict: 'EA',
                scope: {
                    tApi: '=',
                    tRefresh: '&',
                    tAdd: '&',
                    tRemove: '&',
                    tSelect: '&'
                },
                templateUrl: 'partials/directives/toastyTreeExplorer',
                controller: ['$scope',
                    function($scope) {
                        $scope.selectedNode = {};

                        $scope.data = [{
                        	_id: 'nsfdkfdnkfdkfdkfd3930920923',
                            name: 'Root Element',
                            children: [{
                        		_id: 'jffdvlandnvalvn232323',
                                name: 'Level 1',
                                children: [{
                        			_id: 'dsjg95ign54gg54hprea[v',
                                    name: 'Level 2',
                                    children: [{
                        				_id: 'operidmgfkeirnfdmdfkm',
                                        name: 'Level 3',
                                        children: [{
                        					_id: '[poiuyvdss0sd-lkkl]',
                                            name: 'Level 4'
                                        }]
                                    }]
                                }]
                            }]
                        }];

                        $scope.nodeSelected = function(node) {

                        	$scope.selectedNode = node;

                        	$scope.tSelect({
                        		node: node
                        	});

                        };
                    }
                ],
                link: function() {}
            };

            return directive;
        }
    ]);

});
