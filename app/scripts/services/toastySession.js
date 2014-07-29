define(['./module'], function(services) {
    'use strict';
    services.service('ToastySessionSvc', ['$http', '$rootScope', '$log', '$q',
        function($http, $rootScope, $log, $q) {
        	var settings = {
        		siteName: 'ToastyCMS'
        	};

        	$rootScope.settings = settings;

        	return {
        		settings: settings
        	};

        }
    ])
});
