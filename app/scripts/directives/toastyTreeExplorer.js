define(['./module'], function(directives) {
    'use strict';

    directives.directive('toastyTreeExplorer', [

        function() {

            var directive = {
                restrict: 'EA',
                scope: {
                    tApi: '@',
                    tRefresh: '&',
                    tAdd: '&',
                    tRemove: '&',
                    tSelect: '&'
                },
                templateUrl: 'partials/directives/toastyTreeExplorer',
                controller: ['$scope','Restangular','$log',
                    function($scope, Restangular, $log) {
                        $scope.selectedNode = {};
                        $scope.data = [];

                        $scope.treeOptions = {

                            dropped: function(event) {
                                // disable tree

                                if (event.dest.nodesScope.$parent.node) {
                                    // disable tree
                                    var cloneParent = event.dest.nodesScope.$parent.node.clone();

                                    event.source.nodeScope.node.parent = cloneParent._id;
                                    
                                    var requestPromise = event.source.nodeScope.node.put();
                                    requestPromise.then(function() {
                                        // enable tree
                                    });

                                } else {

                                    event.source.nodeScope.node.parent = undefined;
                                    
                                    var requestPromise = event.source.nodeScope.node.put();
                                    requestPromise.then(function() {
                                        // enable tree
                                    });

                                }
                            }

                        };

                        function read() {
                            Restangular.all($scope.tApi).getList().then(function(getListResult) {

                                $scope.data = getListResult;

                            }, function(error) {

                            });
                        }

                        $scope.nodeSelected = function(node) {

                        	$scope.selectedNode = node;

                        	$scope.tSelect({
                        		node: node
                        	});

                        };

                        $scope.$on('management.refresh-tree', read);

                        read();
                    }
                ],
                link: function() {}
            };

            return directive;
        }
    ]);

});
