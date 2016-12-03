// confreq user controller
'use strict';
angular.module('app')
.controller('ConfRegCtrl', function ($scope, UserSvc) {
	
  $scope.confreg = function (password) {
    UserSvc.confreg(password) // call confregister in UserSvc service
    .then(function (response) {
		$scope.$emit('login', response.data); // pass event up to to ApplicationCtrl
		//$location.path('/');
    });
  }
})

.controller('ConfMailCtrl', ['$scope','$routeParams', 'UserSvc', function ($scope, $routeParams, UserSvc) {
	
  var uemail = $routeParams.email; // user e-mail and confirmation token are passed as parameters in the GET-request
  var etoken = $routeParams.token;
  //console.log('confmailctrl hit ' + uemail + ' ' + etoken);
  
  UserSvc.confmail(uemail, etoken) // call confmail in UserSvc service
    .then(function (response) {
		//$scope.$emit('login', response.data); // pass event up to to ApplicationCtrl
		//$location.path('/');
  });
}]);
