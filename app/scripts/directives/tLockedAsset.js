define(['./module'], function(directives) {
		'use strict';

		directives.directive('tLockedAsset', [

				function() {
						return {

								restrict: 'AE',
								scope: {
										tLockedAsset: '@'
								},
								controller: ['$scope', 'AuthenticationSvc',
										function($scope, AuthenticationSvc) {

												$scope.authSvc = AuthenticationSvc;

												function setVisible() {
														$scope.visible = AuthenticationSvc.authorize($scope.tLockedAsset);
												}

												$scope.$watch('authSvc.currentUser', setVisible, true);

												setVisible();

										}
								],
								link: function($scope, tElement, tAttributes) {

										var previousDisplay = angular.element(tElement).css('display');
										$scope.$watch('visible', function(visible) {
												if (!visible) {
														angular.element(tElement).css('display', 'none');
												} else {
														angular.element(tElement).css('display', previousDisplay);
												}
										});

								}

						}
				}
		]);
});
