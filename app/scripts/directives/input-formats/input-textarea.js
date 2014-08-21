define(['./module'], function(directives) {
		'use strict';

		directives.directive('inputTextarea',['$compile', 
				function($compile) {
						return {

								restrict: 'A',
								scope: {
										tProperty: '='
								},
								templateUrl: 'partials/directives/input-textarea'

						}
				}
		]);
});
