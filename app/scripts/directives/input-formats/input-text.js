define(['./module'], function(directives) {
		'use strict';

		directives.directive('inputText',['$compile', 
				function($compile) {
						return {

								restrict: 'A',
								scope: {
										tProperty: '='
								},
								templateUrl: 'partials/directives/input-text'

						}
				}
		]);
});
