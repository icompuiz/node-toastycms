define(['./module'], function (services) {
	'use strict';
	services.service('AuthenticationSvc', ['$http', '$log', '$q', function($http, $log, $q) {

		var auth = {
			login: function(credentials) {

				var promise = $q.defer();

				$http.post('/login', credentials).then(function(data) {

					$log.log('Logged in', data);

					auth.currentUser = data.data;

					promise.resolve(auth.currentUser);

				}, function(error) {

					$log.log('Error While Logging In', error);

					promise.reject(error);

				});

				return promise.promise;

			},
			logout: function() {

				var promise = $q.defer();

				$http.get('/logout').then(function(data) {
					$log.log('Logged out', data);
					
					auth.currentUser = publicUser;

					promise.resolve(data);
				});

				return promise.promise;

			}
		};

		var publicUser = { 
			username: 'public'
		};

		$.ajax('/me', {
			method: 'GET',
			async: false,
			success: function(user) {
				auth.currentUser = user;
			}, 
			error: function() {
				auth.currentUser = publicUser;
			}
		});

		return auth;
		
	}]);

});