define(['./module'], function (controllers) {

	controllers.controller('LoginCtrl', ['$scope','$http', '$log', '$state','AuthenticationSvc', function($scope, $http, $log, $state, AuthenticationSvc) {

		$scope.statusMessage = "";

		$scope.submit = function() {

			AuthenticationSvc.login({
							username: $scope.username,
							password: $scope.password
						}).then(function(data) {

				$state.go('management.authenticated.dashboard.home');

			}, function(error) {

				$scope.statusMessage = error.data.replace('Unauthorized: ', '');

			});

		}

		if (AuthenticationSvc.isLoggedIn()) {
			$state.go('management.authenticated.dashboard.home');
		}
	}]);

});