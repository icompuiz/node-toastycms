define(['./module'], function (controllers) {

	controllers.controller('NavbarCtrl', ['$scope','$http', '$log', '$state','AuthenticationSvc', function($scope, $http, $log, $state, AuthenticationSvc) {

		$scope.auth = AuthenticationSvc;

		$scope.$watch('auth.currentUser', function(newVal) {
			$scope.currentUser = newVal;
		});

		$scope.logout = function() {
			
			AuthenticationSvc.logout().then(function(data) {

				$state.go('login');

			});

		}
	}]);

});