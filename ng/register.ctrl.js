// register user controller
angular.module('app')
.controller('RegisterCtrl', function ($scope, UserSvc) {
	
  $scope.register = function (username, password) {
    UserSvc.register(username, password) // call register in UserSvc service
    .then(function (response) {
		$scope.$emit('login', response.data); // pass event up to to ApplicationCtrl
		//$location.path('/');
    });
  }
});