define(['./module'], function(directives) {
		'use strict';

		directives.directive('toastyFileUpload', ['$compile',
				function($compile) {
						return {

								restrict: 'E',
								scope: {
										onReady: '&',
										directory: '='
								},
								templateUrl: 'partials/directives/toastyFileUpload',
								controller: ['$scope', function($scope) {

									$scope.file = {
										directory: $scope.directory._id
									};

									$scope.$watch('directory', function(newValue) {
										$scope.file.directory = newValue._id;
									});

									function doUpload(callback) {

										if (_.isFunction($scope.doUpload)) {
											$scope.doUpload(callback);
										}

									}

									$scope.onReady({
										properties: {
											submit: doUpload,
											upload: doUpload
										}
									});

								}],
								link: function($scope, tElement, tAttributes) {

									$scope.doUpload = function(callback) {

										console.log('Uploading File')

									}

								}

						}
				}
		]);
});
