define(['./module'], function(directives) {
		'use strict';

		directives.directive('inputRichtext',['$compile', 
				function($compile) {
						return {

								restrict: 'A',
								scope: {
										tProperty: '='
								},
								templateUrl: 'partials/directives/input-richtext'

						}
				}
		]);
});
