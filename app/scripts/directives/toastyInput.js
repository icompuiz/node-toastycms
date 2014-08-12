define(['./module'], function(directives) {
		'use strict';

		directives.directive('toastyInput', ['$compile',
				function($compile) {
						return {

								restrict: 'E',
								scope: {
										tProperty: '='
								},
								link: function($scope, tElement, tAttributes) {

										var wrapper = angular.element('<div data-t-property="tProperty" />');
										wrapper.attr($scope.tProperty.format, true);
										var childScope = $scope.$new();

										childScope.tProperty = $scope.tProperty;
										tElement.append(wrapper);

										$compile(wrapper)(childScope);


								}

						}
				}
		]);
});
